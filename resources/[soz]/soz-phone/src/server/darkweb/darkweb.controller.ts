import {
    DarkwebConversation,
    DarkwebConversationArchiveResult,
    DarkwebConversationResult,
    DarkwebEvents,
    DarkwebParticipantUpdateResult,
} from '../../../typings/app/darkweb';
import {onNetPromise} from '../lib/PromiseNetEvents/onNetPromise';
import {getSource} from '../utils/miscUtils';
import DarkWebService from './darkweb.service';
import {darkwebLogger} from './darkweb.utils';


onNetPromise<{ conversationId: number; message: string }, DarkwebConversationResult>(
    DarkwebEvents.SEND_MESSAGE,
    (reqObj, resp) => {
        DarkWebService.handleSendDarkwebMessage(reqObj, resp).catch(e => {
            darkwebLogger.error(
                `Error occurred in fetch darkweb messages event (${reqObj.source}), Error:  ${e.message}`
            );
            resp({status: 'error', errorMsg: 'UNKNOWN_ERROR'});
        });
    }
);
