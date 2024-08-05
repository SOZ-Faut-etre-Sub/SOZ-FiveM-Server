import {
    DarkwebConversation,
    DarkwebConversationArchiveResult,
    DarkwebConversationResult,
    DarkwebEvents,
    DarkwebParticipantUpdateResult,
} from '../../../typings/app/darkweb';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import { getSource } from '../utils/miscUtils';
import DarkWebService from './darkweb.service';
import { darkwebLogger } from './darkweb.utils';

onNetPromise<void, DarkwebConversation[]>(DarkwebEvents.FETCH_CONVERSATIONS, (reqObj, resp) => {
    DarkWebService.handleFetchConversations(reqObj, resp).catch(e => {
        darkwebLogger.error(
            `Error occurred in fetch darkweb conversations event (${reqObj.source}), Error:  ${e.message}`
        );
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<void, DarkwebConversation[]>(DarkwebEvents.FETCH_PARTICIPANTS, (reqObj, resp) => {
    DarkWebService.handleFetchParticipants(reqObj, resp).catch(e => {
        darkwebLogger.error(
            `Error occurred in fetch darkweb participants event (${reqObj.source}), Error:  ${e.message}`
        );
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<{ conversationId: number }, DarkwebConversation[]>(DarkwebEvents.FETCH_MESSAGES, (reqObj, resp) => {
    DarkWebService.handleFetchmessages(reqObj, resp).catch(e => {
        darkwebLogger.error(`Error occurred in fetch darkweb messages event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<{ label: string; password: string }, DarkwebConversationResult>(
    DarkwebEvents.CREATE_CONVERSATION,
    (reqObj, resp) => {
        DarkWebService.handleCreateDarkwebConversation(reqObj, resp).catch(e => {
            darkwebLogger.error(
                `Error occurred in fetch darkweb messages event (${reqObj.source}), Error:  ${e.message}`
            );
            resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
        });
    }
);

onNetPromise<{ conversationId: number; message: string }, DarkwebConversationResult>(
    DarkwebEvents.SEND_MESSAGE,
    (reqObj, resp) => {
        DarkWebService.handleSendDarkwebMessage(reqObj, resp).catch(e => {
            darkwebLogger.error(
                `Error occurred in fetch darkweb messages event (${reqObj.source}), Error:  ${e.message}`
            );
            resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
        });
    }
);

onNetPromise<{ conversationId: number; phoneNumber: string; role: string }, DarkwebParticipantUpdateResult>(
    DarkwebEvents.UPDATE_PARTICIPANT_ROLE,
    (reqObj, resp) => {
        DarkWebService.handleDarkwebUpdateParticipantRole(reqObj, resp).catch(e => {
            darkwebLogger.error(
                `Error occurred in fetch darkweb paritcipant update event (${reqObj.source}), Error:  ${e.message}`
            );
            resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
        });
    }
);

onNetPromise<{ conversationId: number }, DarkwebConversationArchiveResult>(
    DarkwebEvents.ARCHIVE_CONVERSATION,
    (reqObj, resp) => {
        DarkWebService.handleArchiveDarksebConversation(reqObj, resp).catch(e => {
            darkwebLogger.error(
                `Error occurred in fetch archive conversation event (${reqObj.source}), Error:  ${e.message}`
            );
            resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
        });
    }
);

onNetPromise<{ conversationId: number; label: string; password: string }, DarkwebConversationArchiveResult>(
    DarkwebEvents.UPDATE_CONVERSATION,
    (reqObj, resp) => {
        DarkWebService.handleUpdateConversation(reqObj, resp).catch(e => {
            darkwebLogger.error(
                `Error occurred in fetch archive conversation event (${reqObj.source}), Error:  ${e.message}`
            );
            resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
        });
    }
);

onNetPromise<{ conversationId: number; phoneNumber: string }, void>(
    DarkwebEvents.SET_CONVERSATION_READ,
    async (reqObj, resp) => {
        const src = getSource();
        DarkWebService.handleSetMessageRead(reqObj, resp).catch(e => {
            darkwebLogger.error(`Error occurred in set conversation read event (${src}), Error: ${e.message}`);
            resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
        });
        resp({ status: 'ok' });
    }
);