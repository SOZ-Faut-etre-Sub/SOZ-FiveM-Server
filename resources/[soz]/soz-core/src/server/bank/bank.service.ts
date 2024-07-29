import { Inject, Injectable } from '@core/decorators/injectable';
import { Rpc } from '@core/decorators/rpc';
import { Logger } from '@core/logger';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { BankAccountRepository } from '@public/server/repository/bank.account.repository';
import { BankFarmRepository } from '@public/server/repository/bank.farm.repository';
import { BankActionType, Invoice } from '@public/shared/bank';
import { Err, Ok, Result } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

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

    @Inject(BankFarmRepository)
    private bankFarmRepository: BankFarmRepository;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Logger)
    private logger: Logger;

    @Inject(Monitor)
    private monitor: Monitor;

    public async transferCashMoney(
        source: number,
        accountId: string,
        type: BankActionType,
        moneyType: 'money' | 'marked_money',
        amount: number = 0,
        allowOverflow = false
    ): Promise<boolean> {
        const player = this.QBCore.getPlayer(source);
        if (!player) {
            this.logger.error(`Player ${source} not found`);
            return false;
        }

        const bankAccount = await this.bankAccountRepository.find(accountId);
        if (!bankAccount) {
            this.logger.error(`Bank account ${accountId} not found`);
            return false;
        }

        const playerMoney = player.Functions.GetMoney(moneyType);
        if (type === 'deposit' && Number(playerMoney) < amount) {
            this.notifier.advancedNotify(
                source,
                'Maze Banque',
                `Dépot: ~r~$${amount}`,
                'Fond insuffisant',
                'CHAR_BANK_MAZE',
                'error'
            );
            return false;
        }

        if (type === 'deposit') {
            if (!player.Functions.RemoveMoney(moneyType, amount)) {
                this.notifier.advancedNotify(
                    source,
                    'Maze Banque',
                    `Dépot: ~r~$${amount}`,
                    'Fond insuffisant',
                    'CHAR_BANK_MAZE',
                    'error'
                );
                return false;
            }

            if (!(await this.bankAccountRepository.addMoney(bankAccount.id, amount, moneyType, allowOverflow))) {
                return false;
            }

            this.notifier.advancedNotify(
                source,
                'Maze Banque',
                `Dépot: ~g~$${amount}`,
                "Vous avez déposé de l'argent",
                'CHAR_BANK_MAZE'
            );
        } else {
            if (!(await this.bankAccountRepository.removeMoney(bankAccount.id, amount, moneyType, allowOverflow))) {
                this.notifier.advancedNotify(
                    source,
                    'Maze Banque',
                    `Retrait: ~r~$${amount}`,
                    'Fond insuffisant',
                    'CHAR_BANK_MAZE',
                    'error'
                );
                return false;
            }

            if (!player.Functions.AddMoney(moneyType, amount)) {
                return false;
            }

            this.notifier.advancedNotify(
                source,
                'Maze Banque',
                `Retrait: ~r~$${amount}`,
                "Vous avez retiré de l'argent",
                'CHAR_BANK_MAZE'
            );
        }

        this.monitor.traceEvent(`safe_${type}`, {
            player_source: source,
            target_account: bankAccount.id,
            money_type: moneyType,
            amount: amount,
        });

        return true;
    }

    public async transferFarmMoney(
        source: number,
        farm: string,
        safe: string,
        amount: number = 0,
        moneyType: 'money' | 'marked_money' = 'money'
    ): Promise<boolean> {
        const farmAccount = await this.bankFarmRepository.find(farm);
        if (!farmAccount) {
            this.logger.error(`Farm account ${farm} not found`);
            return false;
        }

        const safeAccount = await this.bankAccountRepository.find(safe);
        if (!safeAccount) {
            this.logger.error(`Safe account ${safe} not found`);
            return false;
        }

        let moneyToTransfer = amount;
        if (farmAccount[moneyType] - amount < 0) {
            moneyToTransfer = farmAccount[moneyType];
        }

        if (!this.bankFarmRepository.removeMoney(farmAccount.id, moneyToTransfer, moneyType)) {
            this.logger.error(`Failed to remove money from farm account ${farm}`);
            return false;
        }

        if (!(await this.bankAccountRepository.addMoney(safeAccount.id, moneyToTransfer, moneyType, false))) {
            this.logger.error(`Failed to add money to safe account ${safe}`);
            return false;
        }

        this.monitor.traceEvent('transfer_money', {
            player_source: source,
            source_account: farmAccount.id,
            target_account: safeAccount.id,
            money: moneyToTransfer,
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
                accountid: citizenId,
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

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT_MONEY)
    public async getAccountMoney(accountId: string, type: 'money' | 'marked_money' = 'money'): Promise<number> {
        const account = await this.bankAccountRepository.find(accountId);
        if (!account) return;

        return account[type];
    }

    public getSafeMoney(identifier: string): number {
        return exports['soz-bank'].GetSafeMoney(identifier);
    }
}
