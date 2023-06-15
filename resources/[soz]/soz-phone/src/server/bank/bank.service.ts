import { IBankCredentials } from '../../../typings/app/bank';
import { BankTransfer } from '../../../typings/banktransfer';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import { bankLogger } from './bank.utils';
import BankTransferDB, { _BankTransferDB } from './bankTransfer.db';

class _BankService {
    private readonly bankTransferDB: _BankTransferDB;
    private readonly qbCore: any;

    constructor() {
        this.bankTransferDB = BankTransferDB;
        this.qbCore = global.exports['qb-core'].GetCoreObject();
    }

    async handleFetchAccount(reqObj: PromiseRequest<void>, resp: PromiseEventResp<IBankCredentials>) {
        try {
            const account = exports['soz-bank'].GetPlayerAccount(reqObj.source);
            resp({ status: 'ok', data: account });
        } catch (e) {
            bankLogger.error(`Error in handleFetchAccount, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }

    async fetchTransfers(reqObj: PromiseRequest<string>, resp: PromiseEventResp<BankTransfer[]>): Promise<void> {
        try {
            const account = exports['soz-bank'].GetPlayerAccount(reqObj.source);
            const transfers = await this.bankTransferDB.getTransfers(account.account);

            let players = this.qbCore.Functions.GetQBPlayers();

            if (!Array.isArray(players)) {
                players = Object.values(players);
            }

            await Promise.all(
                transfers.map(async transfer => {
                    transfer.receiverName = transfer.receiverAccount;
                    transfer.transmitterName = transfer.transmitterAccount;

                    transfer.receiverName = await this.bankTransferDB.getNameFromAccount(transfer.receiverAccount);
                    transfer.transmitterName = await this.bankTransferDB.getNameFromAccount(
                        transfer.transmitterAccount
                    );
                })
            );

            resp({ status: 'ok', data: transfers });
        } catch (e) {
            bankLogger.error(`Error in fetchTransfers, ${e.toString()}`);
            resp({ status: 'error', errorMsg: 'DB_ERROR' });
        }
    }
}

const BankService = new _BankService();
export default BankService;
