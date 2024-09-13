import { DarkwebConversationResult, DarkwebEvents, ThreadPrice } from '../../../typings/app/darkweb';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import DarkwebDB, { _DarkwebDB } from './darkweb.db';
import {
    archiveConversation,
    createDarkwebConversation,
    darkwebLogger,
    getDarkwebConversation,
    getDarkwebConversationParticipants,
    getFormattedDarkwebConversations,
    getFormattedDarkwebMessages,
    getFormattedDarkwebParticipants,
    handleDarkwebUpdateParticipantUnreadStatus,
    sendDarkwebMessage,
    updateConversation,
    updateDarkwebConversationParticipantRole,
} from './darkweb.utils';

class _DarkWebService {
    private readonly darkwebConversationDB: _DarkwebDB;
    private readonly qbCore: any;

    constructor() {
        this.darkwebConversationDB = DarkwebDB;
        darkwebLogger.debug('Darkweb service started');
        this.qbCore = global.exports['qb-core'].GetCoreObject();
    }

    async handleFetchConversations(reqObj: PromiseRequest, resp: PromiseEventResp<any>) {
        try {
            const darkwebConversations = await getFormattedDarkwebConversations();
            resp({ status: 'ok', data: darkwebConversations });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            darkwebLogger.error(`Failed to fetch conversations, ${e.toString()}`);
        }
    }

    async handleFetchmessages(reqObj: PromiseRequest<{ conversationId: number }>, resp: PromiseEventResp<any>) {
        try {
            const darkwebMessages = await getFormattedDarkwebMessages(reqObj.data.conversationId);
            resp({ status: 'ok', data: darkwebMessages });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            darkwebLogger.error(`Failed to fetch conversations, ${e.toString()}`);
        }
    }

    async handleFetchParticipants(reqObj: PromiseRequest, resp: PromiseEventResp<any>) {
        try {
            const darkwebParticipants = await getFormattedDarkwebParticipants();
            resp({ status: 'ok', data: darkwebParticipants });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            darkwebLogger.error(`Failed to fetch participants, ${e.toString()}`);
        }
    }

    async handleCreateDarkwebConversation(
        reqObj: PromiseRequest<{ label: string; password: string }>,
        resp: PromiseEventResp<DarkwebConversationResult>
    ) {
        if (!exports['soz-core'].RemovePlayerMoney(reqObj.source, ThreadPrice, 'marked_money')) {
            resp({
                status: 'ok',
                data: {
                    error: true,
                    errorMessage: "Vous n'avez pas assez d'argent",
                    conversation: null,
                    conversationParticipants: null,
                },
            });
            return;
        }

        try {
            const darkwebConversation = await createDarkwebConversation(
                reqObj.data.label,
                reqObj.data.password,
                reqObj.source
            );

            if (darkwebConversation.error) {
                return resp({ status: 'error' });
            }

            resp({
                status: 'ok',
                data: {
                    error: false,
                    conversation: darkwebConversation.conversation,
                    conversationParticipants: darkwebConversation.conversationParticipants,
                },
            });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });

            darkwebLogger.error(`Failed to create conversation, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }

    async handleSendDarkwebMessage(
        reqObj: PromiseRequest<{ conversationId: number; message: string }>,
        resp: PromiseEventResp<any>
    ) {
        try {
            const player = PlayerService.getPlayer(reqObj.source);
            const darkwebMessage = await sendDarkwebMessage(
                reqObj.data.conversationId,
                reqObj.data.message,
                reqObj.source
            );

            if (darkwebMessage.error) {
                return resp({ status: 'error' });
            }

            const darkwebParticipants = await getDarkwebConversationParticipants(reqObj.data.conversationId);
            const darkwebConversation = await getDarkwebConversation(reqObj.data.conversationId);

            for (const participant of darkwebParticipants) {
                if (participant.phoneNumber !== player.getPhoneNumber()) {
                    const participantPlayer = PlayerService.getPlayerFromIdentifier(participant.user_identifier);

                    await handleDarkwebUpdateParticipantUnreadStatus(
                        reqObj.data.conversationId,
                        participant.phoneNumber,
                        true
                    );

                    if (participantPlayer) {
                        emitNet(DarkwebEvents.UPDATE_BROADCAST_CONVERSATION_MESSAGES, participantPlayer.source, {
                            ...darkwebMessage,
                        });

                        emitNet(DarkwebEvents.UPDATE_BROADCAST_CONVERSATION, participantPlayer.source, {
                            ...darkwebConversation,
                        });
                        participant.unread = true;
                        emitNet(DarkwebEvents.UPDATE_BROADCAST_PARTICIPANTS, participantPlayer.source, {
                            ...participant,
                        });
                    }
                }
            }

            resp({
                status: 'ok',
                data: {
                    error: false,
                    message: darkwebMessage.message,
                },
            });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });

            darkwebLogger.error(`Failed to send message, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }

    async handleDarkwebUpdateParticipantRole(
        reqObj: PromiseRequest<{ conversationId: number; phoneNumber: string; role: string }>,
        resp: PromiseEventResp<any>
    ) {
        try {
            const darkwebParticipant = await updateDarkwebConversationParticipantRole(
                reqObj.data.conversationId,
                reqObj.data.phoneNumber,
                reqObj.data.role
            );

            if (darkwebParticipant.error) {
                return resp({ status: 'error', errorMsg: darkwebParticipant.errorMessage });
            }

            resp({
                status: 'ok',
                data: {
                    error: false,
                    participant: darkwebParticipant.participant,
                },
            });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });

            darkwebLogger.error(`Failed to send message, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }

    async handleArchiveDarksebConversation(
        reqObj: PromiseRequest<{ conversationId: number }>,
        resp: PromiseEventResp<any>
    ) {
        try {
            const archiveResp = await archiveConversation(reqObj.data.conversationId);

            if (archiveResp.error) {
                return resp({ status: 'error', errorMsg: archiveResp.errorMessage });
            }

            resp({
                status: 'ok',
                data: {
                    error: false,
                    conversation: archiveResp.conversation,
                },
            });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });

            darkwebLogger.error(`Failed to archive conversation, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }

    async handleUpdateConversation(
        reqObj: PromiseRequest<{ conversationId: number; label: string; password: string }>,
        resp: PromiseEventResp<any>
    ) {
        try {
            const updateResp = await updateConversation(
                reqObj.data.conversationId,
                reqObj.data.label,
                reqObj.data.password
            );

            if (updateResp.error) {
                return resp({ status: 'error', errorMsg: updateResp.errorMessage });
            }

            resp({
                status: 'ok',
                data: {
                    error: false,
                    conversation: updateResp.conversation,
                },
            });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });

            darkwebLogger.error(`Failed to update conversation, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }

    async handleSetMessageRead(
        reqObj: PromiseRequest<{ conversationId: number; phoneNumber: string }>,
        resp: PromiseEventResp<any>
    ) {
        try {
            await this.darkwebConversationDB.setMessageUnread(
                reqObj.data.conversationId,
                reqObj.data.phoneNumber,
                false
            );
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });

            darkwebLogger.error(`Failed to update conversation, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }
}
const DarkWebService = new _DarkWebService();
export default DarkWebService;
