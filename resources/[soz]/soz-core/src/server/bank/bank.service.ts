import { Injectable } from '@core/decorators/injectable';
import { Invoice } from '@public/shared/bank';
import { Err, Ok, Result } from '@public/shared/result';

import { uuidv4 } from '../../core/utils';
import BankTransferDB from './banktransfer.db';

@Injectable()
export class BankService {
    public transferBankMoney(source: string, target: string, amount: number): Promise<Result<boolean, string>> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferMoney(source, target, amount, (success, reason) => {
                if (success) {
                    resolve(Ok(true));
                } else {
                    resolve(Err(reason));
                }
            });
        });
    }

    public transferCashMoney(source: string, target: number, amount: number): Promise<Result<boolean, string>> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferCashMoney(source, target, amount, (success, reason) => {
                if (success) {
                    resolve(Ok(true));
                } else {
                    resolve(Err(reason));
                }
            });
        });
    }

    async handleBankTransfer(transmitter: string, receiver: string, amount: number) {
        const id = await BankTransferDB.createTransfer(transmitter, receiver, amount);

        TriggerEvent('phone:app:bank:transferBroadcast', `phone:app:bank:transferBroadcast:${uuidv4()}`, {
            id: id,
            amount: amount,
            transmitterAccount: transmitter,
            receiverAccount: receiver,
            createdAt: new Date().getTime(),
        });
    }

    public getAllInvoicesForPlayer(source: number): Record<string, Invoice> {
        return exports['soz-bank'].GetAllInvoicesForPlayer(source);
    }

    public payInvoice(source: number, invoiceId: number, marked: boolean) {
        return exports['soz-bank'].PayInvoice(source, invoiceId, marked);
    }
}
