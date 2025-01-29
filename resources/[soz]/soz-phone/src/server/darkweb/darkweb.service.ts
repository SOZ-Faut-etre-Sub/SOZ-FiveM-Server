import {DarkwebConversationResult, DarkwebEvents, ThreadPrice} from '../../../typings/app/darkweb';
import {PromiseEventResp, PromiseRequest} from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import DarkwebDB, {_DarkwebDB} from './darkweb.db';
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
                return resp({status: 'error'});
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
            resp({status: 'error', errorMsg: 'DB_ERROR'});

            darkwebLogger.error(`Failed to send message, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }

}

const DarkWebService = new _DarkWebService();
export default DarkWebService;
