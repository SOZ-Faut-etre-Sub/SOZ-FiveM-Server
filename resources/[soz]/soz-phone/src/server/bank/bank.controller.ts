import { BankEvents, IBankCredentials } from '../../../typings/app/bank';
import { BankContactItem, BankContactsEvents } from '../../../typings/app/bank_contacts';
import { BankStatementItem, BankStatementsEvents } from '../../../typings/app/bank_statements';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import BankService from './bank.service';
import { bankLogger } from './bank.utils';

onNetPromise<void, IBankCredentials>(BankEvents.FIVEM_EVENT_FETCH_BALANCE, (reqObj, resp) => {
    BankService.handleFetchAccount(reqObj, resp).catch(e => {
        bankLogger.error(`Error occured in fetch bank event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<void, BankStatementItem[]>(BankStatementsEvents.FETCH_LAST_STATEMENTS, (reqObj, resp) => {
    BankService.handleFetchLastStatements(reqObj, resp).catch(e => {
        bankLogger.error(`Error occurred in fetch bank statements event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});

onNetPromise<void, BankContactItem[]>(BankContactsEvents.FETCH_ALL_CONTACTS, (reqObj, resp) => {
    BankService.handleFetchContacts(reqObj, resp).catch(e => {
        bankLogger.error(`Error occurred in fetch bank contacts event (${reqObj.source}), Error:  ${e.message}`);
        resp({ status: 'error', errorMsg: 'UNKNOWN_ERROR' });
    });
});
