import { Message, MessageConversationResponse, MessageEvents, PreDBMessage } from '../../../typings/messages';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
import MessagesDB, { _MessagesDB } from './messages.db';
import {
    createMessageGroupsFromPhoneNumber,
    getFormattedMessageConversations,
    getIdentifiersFromParticipants,
    messagesLogger,
} from './messages.utils';

class _MessagesService {
    private readonly messagesDB: _MessagesDB;

    constructor() {
        this.messagesDB = MessagesDB;
        messagesLogger.debug('Messages service started');
    }

    async handleFetchMessageConversations(reqObj: PromiseRequest, resp: PromiseEventResp<any>) {
        try {
            const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
            const messageConversations = await getFormattedMessageConversations(phoneNumber);

            resp({ status: 'ok', data: messageConversations });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            messagesLogger.error(`Failed to fetch messages groups, ${e.toString()}`);
        }
    }

    async handleCreateMessageConversation(
        reqObj: PromiseRequest<{ targetNumber: string }>,
        resp: PromiseEventResp<MessageConversationResponse>
    ) {
        try {
            const sourcePlayer = PlayerService.getPlayer(reqObj.source);

            const result = await createMessageGroupsFromPhoneNumber(
                sourcePlayer.getPhoneNumber(),
                reqObj.data.targetNumber
            );

            if (result.error) {
                return resp({ status: 'error' });
            }

            try {
                const participant = PlayerService.getPlayerFromIdentifier(result.participant);

                if (participant) {
                    emitNet(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, participant.source, {
                        conversation_id: result.conversationId,
                        phoneNumber: sourcePlayer.getPhoneNumber(),
                        updatedAt: result.updatedAt,
                    });
                }
            } catch (e) {
                resp({ status: 'error', errorMsg: e.toString() });
                messagesLogger.error(e.toString());
            }

            resp({
                status: 'ok',
                data: {
                    conversation_id: result.conversationId,
                    phoneNumber: result.phoneNumber,
                    updatedAt: result.updatedAt,
                },
            });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });

            messagesLogger.error(`Failed to create message group, ${e.toString()}`, {
                source: reqObj.source,
                e,
            });
        }
    }

    async handleFetchMessages(reqObj: PromiseRequest<void>, resp: PromiseEventResp<Message[]>) {
        try {
            const phoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();
            const messages = await this.messagesDB.getMessages(phoneNumber);

            resp({ status: 'ok', data: messages });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            messagesLogger.error(`Failed to fetch messages, ${e.toString()}`, {
                source: reqObj.source,
            });
        }
    }

    async handleSendMessage(reqObj: PromiseRequest<PreDBMessage>, resp: PromiseEventResp<Message>) {
        try {
            const player = PlayerService.getPlayer(reqObj.source);
            const authorPhoneNumber = player.getPhoneNumber();
            const messageData = reqObj.data;
            const participants = getIdentifiersFromParticipants(messageData.conversationId);
            const userIdentifier = player.getIdentifier();

            const messageId = await this.messagesDB.createMessage(
                userIdentifier,
                authorPhoneNumber,
                messageData.conversationId,
                messageData.message
            );

            resp({
                status: 'ok',
                data: {
                    ...messageData,
                    conversation_id: messageData.conversationId,
                    author: authorPhoneNumber,
                    id: messageId,
                },
            });

            // participantId is the participants phone number
            for (const participantId of participants) {
                if (participantId !== player.getPhoneNumber()) {
                    const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(participantId);
                    const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

                    if (participantPlayer) {
                        emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, participantPlayer.source, messageData);
                        emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
                            conversationName: player.getPhoneNumber(),
                            conversationId: messageData.conversationId,
                            message: messageData.message,
                        });
                        emitNet(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, participantPlayer.source, {
                            conversation_id: messageData.conversationId,
                            phoneNumber: authorPhoneNumber,
                        });
                    }
                }
            }

            emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, reqObj.source, {
                ...messageData,
                conversation_id: messageData.conversationId,
                author: authorPhoneNumber,
                id: messageId,
            });
        } catch (e) {
            resp({ status: 'error', errorMsg: e.toString() });
            messagesLogger.error(`Failed to send message, ${e.toString()}`, {
                source: reqObj.source,
            });
        }
    }

    async handleSetMessageRead(src: number, groupId: string) {
        try {
            const identifier = PlayerService.getIdentifier(src);
            await this.messagesDB.setMessageRead(groupId, identifier);
            emitNet(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, src);
        } catch (e) {
            messagesLogger.error(`Failed to set message as read, ${e.toString()}`, {
                source: src,
            });
        }
    }

    async handleDeleteConversation(
        reqObj: PromiseRequest<{ conversationsId: string[] }>,
        resp: PromiseEventResp<void>
    ) {
        try {
            const sourcePhoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

            for (const id of reqObj.data.conversationsId) {
                await this.messagesDB.deleteConversation(id, sourcePhoneNumber);
            }
            resp({ status: 'ok' });
        } catch (e) {
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
            messagesLogger.error(`Failed to delete conversation, ${e.toString()}`, {
                source: reqObj.source,
            });
        }
    }
}

const MessagesService = new _MessagesService();

export default MessagesService;
