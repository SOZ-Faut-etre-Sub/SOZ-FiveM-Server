import { Inject, Injectable } from '@core/decorators/injectable';
import { Invoice } from '@public/shared/bank';
import { Err, Ok, Result } from '@public/shared/result';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BankService {
    @Inject(PrismaService)
    private prismaService: PrismaService;

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

    public addAccountMoney(
        account: any,
        amount: number,
        type: 'money' | 'marked_money' = 'money',
        allowOverflow = false
    ): boolean {
        return exports['soz-bank'].AddAccountMoney(account, amount, type, allowOverflow);
    }

    public getAllInvoicesForPlayer(source: number): Record<string, Invoice> {
        return exports['soz-bank'].GetAllInvoicesForPlayer(source);
    }

    public payInvoice(source: number, invoiceId: number, marked: boolean) {
        return exports['soz-bank'].PayInvoice(source, invoiceId, marked);
    }

    public async getAccountid(citizenId) {
        const bankAccount = await this.prismaService.bank_accounts.findFirst({
            where: {
                citizenid: citizenId,
            },
        });
        return bankAccount.accountid;
    }

    public addMoney(
        targetAccount: string,
        amount: number,
        type: 'money' | 'marked_money' = 'money',
        allowOverflow = false
    ) {
        exports['soz-bank'].AddMoney(targetAccount, amount, type, allowOverflow);
    }

    public clearAccount(targetAccount: string) {
        exports['soz-bank'].ClearAccount(targetAccount);
    }
}
