import { BankEvents, IBankCredentials } from '../../../typings/app/bank';
import { BankTransfer, TransfersListEvents } from '../../../typings/banktransfer';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import BankService from './bank.service';
import { bankLogger } from './bank.utils';

onNetPromise<void, IBankCredentials>(BankEvents.FIVEM_EVENT_FETCH_BALANCE, (reqObj, resp) => {
    BankService.handleFetchAccount(reqObj, resp).catch(e => {
        bankLogger.error(`Error occured in fetch bank event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<string, BankTransfer[]>(TransfersListEvents.FETCH_TRANSFERS, (reqObj, resp) => {
    BankService.fetchTransfers(reqObj, resp).catch(e => {
        bankLogger.error(`Error occured in fetch transfers event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
});
