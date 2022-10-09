import {
    Message,
    MessageConversation,
    MessageConversationResponse,
    MessageEvents,
    PreDBMessage,
} from '../../../typings/messages';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import { getSource } from '../utils/miscUtils';
import MessagesService from './messages.service';
import { messagesLogger } from './messages.utils';

onNetPromise<void, MessageConversation[]>(MessageEvents.FETCH_MESSAGE_CONVERSATIONS, async (reqObj, resp) => {
    MessagesService.handleFetchMessageConversations(reqObj, resp).catch(e => {
        messagesLogger.error(`Error occurred in fetch message conversations (${reqObj.source}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<{ targetNumber: string }, MessageConversationResponse>(
    MessageEvents.CREATE_MESSAGE_CONVERSATION,
    async (reqObj, resp) => {
        MessagesService.handleCreateMessageConversation(reqObj, resp).catch(e => {
            messagesLogger.error(
                `Error occurred on creating messsage converations (${reqObj.source}), Error: ${e.message}`
            );
            resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
        });
    }
);

onNetPromise<void, Message[]>(MessageEvents.FETCH_MESSAGES, async (reqObj, resp) => {
    MessagesService.handleFetchMessages(reqObj, resp).catch(e => {
        messagesLogger.error(`Error occurred in fetch messages (${reqObj.source}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<PreDBMessage, Message>(MessageEvents.SEND_MESSAGE, async (reqObj, resp) => {
    MessagesService.handleSendMessage(reqObj, resp).catch(e => {
        messagesLogger.error(`Error occurred while sending message (${reqObj.source}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<{ conversationsId: string[] }, void>(MessageEvents.DELETE_CONVERSATION, async (reqObj, resp) => {
    MessagesService.handleDeleteConversation(reqObj, resp).catch(e => {
        messagesLogger.error(`Error occurred while deleting conversation (${reqObj.source}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<{ conversation_id: string }, void>(MessageEvents.SET_MESSAGE_READ, async (reqObj, resp) => {
    const src = getSource();
    MessagesService.handleSetMessageRead(src, reqObj.data.conversation_id).catch(e => {
        messagesLogger.error(`Error occurred in set message read event (${src}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
    resp({ status: 'ok' });
});

onNetPromise<{ conversation_id: string }, void>(MessageEvents.SET_CONVERSATION_ARCHIVED, async (reqObj, resp) => {
    const src = getSource();
    MessagesService.handleSetConversationArchived(src, reqObj.data.conversation_id).catch(e => {
        messagesLogger.error(`Error occurred in set message read event (${src}), Error: ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
    resp({ status: 'ok' });
});
