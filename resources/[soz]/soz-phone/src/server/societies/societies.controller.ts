import { DBSocietyUpdate, PreDBSociety, SocietyEvents, SocietyMessage } from '../../../typings/society';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import SocietyService from './societies.service';
import { societiesLogger } from './societies.utils';

const exps = global.exports;

exps('sendSocietyMessage', (reqObj: PreDBSociety) =>
    SocietyService.handleSendSocietyMessage({ data: reqObj, source: null }, () => {})
);

onNetPromise<PreDBSociety, number>(SocietyEvents.SEND_SOCIETY_MESSAGE, (reqObj, resp) => {
    SocietyService.handleSendSocietyMessage(reqObj, resp).catch(e => {
        societiesLogger.error(`Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<string, SocietyMessage[]>(SocietyEvents.FETCH_SOCIETY_MESSAGES, (reqObj, resp) => {
    SocietyService.fetchSocietyMessages(reqObj, resp).catch(e => {
        societiesLogger.error(`Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<DBSocietyUpdate, boolean>(SocietyEvents.UPDATE_SOCIETY_MESSAGE, (reqObj, resp) => {
    SocietyService.updateSocietyMessage(reqObj, resp).catch(e => {
        societiesLogger.error(`Error occured in updateSocietyMessage event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});

onNetPromise<string, SocietyMessage[]>(SocietyEvents.RESET_SOCIETY_MESSAGES, (reqObj, resp) => {
    SocietyService.fetchSocietyMessages(reqObj, resp).catch(e => {
        societiesLogger.error(`Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
