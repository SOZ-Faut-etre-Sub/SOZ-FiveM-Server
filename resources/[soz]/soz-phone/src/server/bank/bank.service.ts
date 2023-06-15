import { IBankCredentials } from '../../../typings/app/bank';
import { BankTransfer, TransfersListEvents } from '../../../typings/banktransfer';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import PlayerService from '../players/player.service';
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

    async handleNewTransfer(reqObj: PromiseRequest<BankTransfer>, resp: PromiseEventResp<number>): Promise<void> {
        const receiverIdentifier = await PlayerService.getIdentifierByAccount(reqObj.data.receiverAccount);
        const receiverPlayer = PlayerService.getPlayerFromIdentifier(receiverIdentifier);

        const transmitterIdentifier = await PlayerService.getIdentifierByAccount(reqObj.data.transmitterAccount);
        const transmitterPlayer = PlayerService.getPlayerFromIdentifier(transmitterIdentifier);

        const receiverName = await this.bankTransferDB.getNameFromAccount(reqObj.data.receiverAccount);
        const transmitterName = await this.bankTransferDB.getNameFromAccount(reqObj.data.transmitterAccount);

        if (receiverPlayer) {
            emitNet(TransfersListEvents.TRANSFER_BROADCAST, receiverPlayer.source, {
                id: reqObj.data.id,
                amount: reqObj.data.amount,
                transmitterAccount: reqObj.data.transmitterAccount,
                receiverAccount: reqObj.data.receiverAccount,
                receiverName: receiverName,
                transmitterName: transmitterName,
                createdAt: reqObj.data.id,
            });
        }

        if (transmitterPlayer) {
            emitNet(TransfersListEvents.TRANSFER_BROADCAST, transmitterPlayer.source, {
                id: reqObj.data.id,
                amount: reqObj.data.amount,
                transmitterAccount: reqObj.data.transmitterAccount,
                receiverAccount: reqObj.data.receiverAccount,
                receiverName: receiverName,
                transmitterName: transmitterName,
                createdAt: reqObj.data.id,
            });
        }
        resp({ status: 'ok', data: 1 });
    }
}

const BankService = new _BankService();
export default BankService;
