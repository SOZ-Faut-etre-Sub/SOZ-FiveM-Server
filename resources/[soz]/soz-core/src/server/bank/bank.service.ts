import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { BankAccountRepository } from '@public/server/repository/bank.account.repository';
import { Invoice } from '@public/shared/bank';
import { Err, Ok, Result } from '@public/shared/result';

import { PrismaService } from '../database/prisma.service';
import { QBCore } from '../qbcore';

@Injectable()
export class BankService {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Logger)
    private logger: Logger;

    @Inject(Monitor)
    private monitor: Monitor;

    public async transferSafeMoney(
        source: number,
        safe: string,
        type: 'deposit' | 'withdraw',
        moneyType: 'money' | 'marked_money',
        amount: number = 0,
        allowOverflow = false
    ): Promise<boolean> {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            this.logger.error(`Player ${source} not found`);
            return false;
        }

        const safeAccount = await this.bankAccountRepository.find(safe);
        if (!safeAccount) {
            this.logger.error(`Safe account ${safe} not found`);
            return false;
        }

        const playerMoney = player.Functions.GetMoney(moneyType);
        if (type === 'deposit' && Number(playerMoney) < amount) {
            this.notifier.error(source, "Vous n'avez pas assez d'argent sur vous");
            return false;
        }

        if (type === 'deposit') {
            if (!player.Functions.RemoveMoney(moneyType, amount)) {
                this.notifier.error(source, "Vous n'avez pas assez d'argent sur vous");
                return false;
            }

            if (!(await this.bankAccountRepository.addMoney(safe, amount, moneyType, allowOverflow))) {
                return false;
            }

            this.notifier.notify(source, `Vous avez déposé $${amount} dans le coffre`);
        } else {
            if (!(await this.bankAccountRepository.removeMoney(safe, amount, moneyType, allowOverflow))) {
                this.notifier.error(source, "Le coffre n'a pas assez d'argent");
                return false;
            }

            if (!player.Functions.AddMoney(moneyType, amount)) {
                return false;
            }

            this.notifier.notify(source, `Vous avez retiré $${amount} du coffre`);
        }

        this.monitor.traceEvent(`safe_${type}`, {
            player_source: source,
            target_account: safe,
            money_type: moneyType,
            amount: amount,
        });

        return true;
    }

    public transferBankMoney(
        source: string,
        target: string,
        amount: number,
        allowOverflow = false
    ): Promise<Result<boolean, string>> {
        return new Promise(resolve => {
            exports['soz-bank'].TransferMoney(
                source,
                target,
                amount,
                (success, reason) => {
                    if (success) {
                        resolve(Ok(true));
                    } else {
                        resolve(Err(reason));
                    }
                },
                allowOverflow
            );
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

    public getAccountMoney(accountName: string, type: 'money' | 'marked_money' = 'money'): number {
        return exports['soz-bank'].GetAccountMoney(accountName, type);
    }

    public getSafeMoney(identifier: string): number {
        return exports['soz-bank'].GetSafeMoney(identifier);
    }
}
