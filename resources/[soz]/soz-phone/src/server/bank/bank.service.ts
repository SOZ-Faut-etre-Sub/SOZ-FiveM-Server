import { IBankCredentials } from '../../../typings/app/bank';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { bankLogger } from './bank.utils';

class _BankService {
    async handleFetchAccount(reqObj: PromiseRequest<void>, resp: PromiseEventResp<IBankCredentials>) {
        try {
            const account = await exports['soz-core'].GetPlayerAccount(reqObj.source);
            resp({ status: 'ok', data: account });
        } catch (e) {
            bankLogger.error(`Error in handleFetchAccount, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const BankService = new _BankService();
export default BankService;
