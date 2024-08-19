import { IBankCredentials } from '../../../typings/app/bank';
import { BankContactItem } from '../../../typings/app/bank_contacts';
import { BankStatementItem } from '../../../typings/app/bank_statements';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { bankLogger } from './bank.utils';

class _BankService {
    constructor() {
        bankLogger.debug('Bank service started');
    }

    async handleFetchAccount(reqObj: PromiseRequest<void>, resp: PromiseEventResp<IBankCredentials>) {
        try {
            const account = await exports['soz-core'].GetPlayerAccount(reqObj.source);
            resp({ status: 'ok', data: account });
        } catch (e) {
            bankLogger.error(`Error in handleFetchAccount, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handleFetchLastStatements(reqObj: PromiseRequest<void>, resp: PromiseEventResp<BankStatementItem[]>) {
        try {
            let statements = await exports['soz-core'].GetStatementsForPlayer(reqObj.source);

            if (!Array.isArray(statements)) {
                statements = Object.values(statements);
            }

            resp({ status: 'ok', data: statements });
        } catch (e) {
            bankLogger.error(`Error in handleFetchLastStatements, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async handleFetchContacts(reqObj: PromiseRequest<void>, resp: PromiseEventResp<BankContactItem[]>) {
        try {
            let contacts = await exports['soz-core'].GetPlayerBankContacts(reqObj.source);

            if (!Array.isArray(contacts)) {
                contacts = Object.values(contacts);
            }

            resp({ status: 'ok', data: contacts });
        } catch (e) {
            bankLogger.error(`Error in handleFetchContacts, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const BankService = new _BankService();
export default BankService;
