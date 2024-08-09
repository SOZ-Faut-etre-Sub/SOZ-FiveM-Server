import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { BankAccountRepository } from '@public/server/repository/bank.account.repository';
import { BankFarmRepository } from '@public/server/repository/bank.farm.repository';
import { BankActionType, BankMoneyType } from '@public/shared/bank';

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
        moneyType: BankMoneyType,
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

        if (['housestorages', 'safestorages'].includes(bankAccount.type)) {
            this.monitor.traceEvent(`safe_${type}`, {
                player_source: source,
                target_account: bankAccount.id,
                money_type: moneyType,
                amount: amount,
            });
        }

        await this.prismaService.bank_statements.create({
            data: {
                source_accountid: player.PlayerData.charinfo.account,
                target_accountid: bankAccount.id,
                amount: amount,
                reason: "dépôt d'argent",
            },
        });

        return true;
    }

    public async transferFarmMoney(
        source: number,
        farm: string,
        safe: string,
        amount: number = 0,
        moneyType: BankMoneyType = 'money',
        isRefund = false
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

        if (isRefund) {
            if (safeAccount[moneyType] - amount < 0) {
                this.logger.error(`Safe account ${safe} has not enough money`);
                return false;
            }

            if (!(await this.bankAccountRepository.removeMoney(safeAccount.id, amount, moneyType, false))) {
                this.logger.error(`Failed to remove money from safe account ${safe}`);
                return false;
            }

            if (!this.bankFarmRepository.addMoney(farmAccount.id, amount, moneyType)) {
                this.logger.error(`Failed to add money to farm account ${farm}`);
                return false;
            }

            this.monitor.traceEvent('transfer_money', {
                player_source: source,
                source_account: safeAccount.id,
                target_account: farmAccount.id,
                money: amount,
            });

            return true;
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

    public async transferBankMoney(
        accountSource: string,
        accountTarget: string,
        moneyType: BankMoneyType,
        amount: number,
        allowOverflow = false,
        reason = ''
    ): Promise<boolean> {
        const sourceAccount = await this.bankAccountRepository.find(accountSource);
        if (!sourceAccount) {
            this.logger.error(`Account ${accountSource} not found`);
            return false;
        }

        const targetAccount = await this.bankAccountRepository.find(accountTarget);
        if (!targetAccount) {
            this.logger.error(`Account ${accountTarget} not found`);
            return false;
        }

        if (!(await this.bankAccountRepository.removeMoney(sourceAccount.id, amount, moneyType))) {
            this.logger.error(`Failed to remove money from account ${sourceAccount.id}`);
            return false;
        }

        if (!(await this.bankAccountRepository.addMoney(targetAccount.id, amount, moneyType, allowOverflow))) {
            await this.bankAccountRepository.addMoney(sourceAccount.id, amount, moneyType, allowOverflow);
            this.logger.error(`Failed to add money to account ${targetAccount.id}`);
            return false;
        }

        await this.prismaService.bank_statements.create({
            data: {
                source_accountid: sourceAccount.id,
                target_accountid: targetAccount.id,
                amount: amount,
                reason,
            },
        });

        this.monitor.traceEvent('transfer_money', {
            player_source: source,
            source_account: accountSource,
            target_account: accountTarget,
            money: amount,
        });

        return true;
    }

    public async addAccountMoney(
        account: any,
        amount: number,
        type: BankMoneyType = 'money',
        allowOverflow = false
    ): Promise<boolean> {
        return this.bankAccountRepository.addMoney(account.id, amount, type, allowOverflow);
    }

    public async clearAccount(targetAccount: string) {
        return this.bankAccountRepository.clear(targetAccount);
    }

    public async getAccountMoney(accountId: string, type: BankMoneyType = 'money'): Promise<number> {
        const account = await this.bankAccountRepository.find(accountId);
        if (!account) return;

        return account[type];
    }
}
