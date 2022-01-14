import PlayerService from '../players/player.service';
import {
  Message,
  MessageConversationResponse,
  MessageEvents,
  PreDBMessage,
} from '../../../typings/messages';
import MessagesDB, { _MessagesDB } from './messages.db';
import {
  createMessageGroupsFromPhoneNumber,
  getFormattedMessageConversations,
  getIdentifiersFromParticipants,
  messagesLogger,
} from './messages.utils';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

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
      messagesLogger.error(`Failed to fetch messages groups, ${e.message}`);
    }
  }

  async handleCreateMessageConversation(
    reqObj: PromiseRequest<{ targetNumber: string }>,
    resp: PromiseEventResp<MessageConversationResponse>,
  ) {
    try {
      const sourcePlayer = PlayerService.getPlayer(reqObj.source);

      const result = await createMessageGroupsFromPhoneNumber(
        sourcePlayer.getPhoneNumber(),
        reqObj.data.targetNumber,
      );

      if (result.error) {
        return resp({ status: 'error' });
      }

      if (!result.doesExist) {
        try {
          const participant = PlayerService.getPlayerFromIdentifier(result.participant);

          if (participant) {
            emitNet(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, participant.source, {
              conversation_id: result.conversationId,
              phoneNumber: sourcePlayer.getPhoneNumber(),
            });
          }
        } catch (e) {
          resp({ status: 'error', errorMsg: e.message });
          messagesLogger.error(e.message);
        }
      }

      resp({
        status: 'ok',
        data: { conversation_id: result.conversationId, phoneNumber: result.phoneNumber },
      });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });

      messagesLogger.error(`Failed to create message group, ${e.message}`, {
        source: reqObj.source,
        e,
      });
    }
  }

  async handleFetchMessages(
    reqObj: PromiseRequest<{ conversationId: string; page: number }>,
    resp: PromiseEventResp<Message[]>,
  ) {
    try {
      const messages = await this.messagesDB.getMessages(
        reqObj.data.conversationId,
        reqObj.data.page,
      );

      messages.sort((a, b) => a.id - b.id);

      resp({ status: 'ok', data: messages });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to fetch messages, ${e.message}`, {
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
        messageData.message,
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
          const participantIdentifier = await PlayerService.getIdentifierByPhoneNumber(
            participantId,
          );
          const participantPlayer = PlayerService.getPlayerFromIdentifier(participantIdentifier);

          if (participantPlayer) {
            emitNet(MessageEvents.SEND_MESSAGE_SUCCESS, participantPlayer.source, messageData);
            emitNet(MessageEvents.CREATE_MESSAGE_BROADCAST, participantPlayer.source, {
              conversationName: player.getPhoneNumber(),
              conversationId: messageData.conversationId,
              message: messageData.message,
            });
          }
        }
      }
    } catch (e) {
      resp({ status: 'error', errorMsg: e.message });
      messagesLogger.error(`Failed to send message, ${e.message}`, {
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
      messagesLogger.error(`Failed to set message as read, ${e.message}`, {
        source: src,
      });
    }
  }

  async handleDeleteConversation(
    reqObj: PromiseRequest<{ conversationsId: string[] }>,
    resp: PromiseEventResp<void>,
  ) {
    try {
      const sourcePhoneNumber = PlayerService.getPlayer(reqObj.source).getPhoneNumber();

      for (const id of reqObj.data.conversationsId) {
        await this.messagesDB.deleteConversation(id, sourcePhoneNumber);
      }
      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to delete conversation, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }

  async handleDeleteMessage(reqObj: PromiseRequest<Message>, resp: PromiseEventResp<void>) {
    try {
      await this.messagesDB.deleteMessage(reqObj.data);
      resp({ status: 'ok' });
    } catch (e) {
      resp({ status: 'error', errorMsg: 'DB_ERROR' });
      messagesLogger.error(`Failed to delete message, ${e.message}`, {
        source: reqObj.source,
      });
    }
  }
}

const MessagesService = new _MessagesService();

export default MessagesService;
