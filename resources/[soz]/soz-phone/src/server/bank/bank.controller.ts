import { BankEvents, IBankCredentials } from '../../../typings/app/bank';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import BankService from './bank.service';
import { bankLogger } from './bank.utils';

onNetPromise<void, IBankCredentials>(BankEvents.FIVEM_EVENT_FETCH_BALANCE, (reqObj, resp) => {
    BankService.handleFetchAccount(reqObj, resp).catch(e => {
        bankLogger.error(`Error occured in fetch bank event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});
