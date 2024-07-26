import { HousingRepository } from '@public/server/repository/housing.repository';

import { HouseSafeStorageTiers, SafeStorageMaxCapacity, SocietySafeStorage } from '../../config/bank';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { BankAccount } from '../../shared/bank';
import { JobType } from '../../shared/job';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';
import { Repository } from './repository';
import { bank_accountsWhereUniqueInput } from '.prisma/client';

@Injectable(BankAccountRepository, Repository)
export class BankAccountRepository extends Repository<RepositoryType.BankAccount> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    public type = RepositoryType.BankAccount;

    protected async load(): Promise<Record<string, BankAccount>> {
        const result = await this.prismaService.bank_accounts.findMany();
        const accounts = {};

        for (const account of result) {
            let accountId = account.accountid;
            let accountType = String(account.account_type);
            let accountLabel = account.citizenid;
            let accountMaxCapacity = null;
            const coords = JSON.parse(account.coords) as { x: number; y: number };

            const safeStorage = SocietySafeStorage[account.businessid?.replace('safe_', '')];

            switch (account.account_type) {
                case 'business':
                    accountId = account.businessid;
                    accountLabel = this.jobService.getJob(accountId as JobType)?.label ?? accountId;
                    break;
                case 'safestorages':
                    if (account.houseid) {
                        const apartment = await this.housingRepository.getApartmentByIdentifier(account.houseid);

                        accountId = account.houseid;
                        accountType = 'house_safe';
                        accountLabel = apartment.label;
                        accountMaxCapacity = HouseSafeStorageTiers[apartment.tier ?? 0];
                        break;
                    }
                    accountId = account.businessid;
                    accountLabel = safeStorage?.label ?? accountId;
                    accountMaxCapacity = SafeStorageMaxCapacity;
                    break;
                case 'offshore':
                    accountId = account.businessid;
                    accountLabel = safeStorage?.label ?? accountId;
                    break;
                case 'bank_atm':
                    break;
            }

            accounts[accountId] = {
                id: accountId,
                type: accountType,
                label: accountLabel,
                owner: accountId,
                money: Number(account.money ?? 0),
                marked_money: Number(account.marked_money ?? 0),
                maxCapacity: accountMaxCapacity,
                coords: account.coords ? [coords.x, coords.y] : null,
            };
        }

        return accounts;
    }

    public async addMoney(
        accountId: string,
        money: number,
        moneyType: 'money' | 'marked_money' = 'money',
        allowOverflow: boolean = false
    ): Promise<boolean> {
        const account = this.data[accountId];
        if (!account) {
            return;
        }

        if (
            !allowOverflow &&
            (account.type === 'house_safe' || account.type === 'safestorages') &&
            account[moneyType] + money > account.maxCapacity
        ) {
            return false;
        }

        const bank_account = await this.prismaService.bank_accounts.update({
            where: this.getDatabaseCondition(account),
            data: {
                [moneyType]: { increment: money },
            },
        });

        this.data[accountId][moneyType] = Number(bank_account[moneyType]);

        return true;
    }

    public async removeMoney(
        accountId: string,
        money: number,
        moneyType: 'money' | 'marked_money' = 'money',
        allowOverflow: boolean = false
    ): Promise<boolean> {
        const account = this.data[accountId];
        if (!account) {
            return;
        }

        if (!allowOverflow && account[moneyType] - money < 0) {
            return false;
        }

        const bank_account = await this.prismaService.bank_accounts.update({
            where: this.getDatabaseCondition(account),
            data: {
                [moneyType]: { decrement: money },
            },
        });

        this.data[accountId][moneyType] = Number(bank_account[moneyType]);

        return true;
    }

    protected getDatabaseCondition(account: BankAccount): bank_accountsWhereUniqueInput {
        switch (account.type) {
            case 'safestorages':
                return { businessid: account.id };
            case 'house_safe':
                return { houseid: account.id };
            default:
                throw new Error('Invalid account type');
        }
    }
}
