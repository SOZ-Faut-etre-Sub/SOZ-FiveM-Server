import { bank_accounts } from '@prisma/client';
import { HousingRepository } from '@public/server/repository/housing.repository';
import { toVector2Object, Vector3 } from '@public/shared/polyzone/vector';

import { AtmConfig, HouseSafeStorageTiers, SafeStorageMaxCapacity, SocietySafeStorage } from '../../config/bank';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { AtmType, BankAccount, BankAccountType } from '../../shared/bank';
import { JobType } from '../../shared/job';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';
import { Repository } from './repository';

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
            const serializedData = await this.serializeFromDatabase(account);

            accounts[serializedData.id] = serializedData;
        }

        return accounts;
    }

    public async create(
        accountId: string,
        accountType: BankAccountType,
        atmType?: AtmType,
        coords?: Vector3
    ): Promise<BankAccount> {
        const data = await this.prismaService.bank_accounts.create({
            data: {
                ...this.getDatabaseCondition({ id: accountId, type: accountType } as any),
                account_type: accountType as any,
                money: this.getDefaultMoney(accountType, atmType),
                coords: JSON.stringify(toVector2Object(coords)),
            },
        });

        this.data[accountId] = await this.serializeFromDatabase(data);

        return this.data[accountId];
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

    protected getDatabaseCondition(account: BankAccount) {
        switch (account.type) {
            case 'bank_atm':
                return { businessid: account.id };
            case 'safestorages':
                return { businessid: account.id };
            case 'house_safe':
                return { houseid: account.id };
            default:
                throw new Error('Invalid account type');
        }
    }

    protected getDefaultMoney(type: BankAccountType, atmType?: AtmType): number {
        switch (type) {
            case 'player':
                return 5_000;
            case 'business':
                return 200_000;
            case 'bank_atm':
                return AtmConfig[atmType].maxMoney;
            default:
                return 0;
        }
    }

    protected async serializeFromDatabase(data: bank_accounts): Promise<BankAccount> {
        let accountId = data.accountid;
        let accountType: BankAccountType = data.account_type as any;
        let accountLabel = data.citizenid;
        let accountMaxCapacity = null;

        const coords = JSON.parse(data.coords) as { x: number; y: number };
        const safeStorage = SocietySafeStorage[data.businessid?.replace('safe_', '')];

        switch (data.account_type) {
            case 'business':
                accountId = data.businessid;
                accountLabel = this.jobService.getJob(accountId as JobType)?.label ?? accountId;
                break;
            case 'safestorages':
                if (data.houseid) {
                    const apartment = await this.housingRepository.getApartmentByIdentifier(data.houseid);

                    accountId = data.houseid;
                    accountType = 'house_safe';
                    accountLabel = apartment.label;
                    accountMaxCapacity = HouseSafeStorageTiers[apartment.tier ?? 0];
                    break;
                }
                accountId = data.businessid;
                accountLabel = safeStorage?.label ?? accountId;
                accountMaxCapacity = SafeStorageMaxCapacity;
                break;
            case 'offshore':
                accountId = data.businessid;
                accountLabel = safeStorage?.label ?? accountId;
                break;
            case 'bank_atm':
                accountId = data.businessid;
                accountType = 'bank_atm';
                accountLabel = safeStorage?.label ?? accountId;
                break;
        }

        return {
            id: accountId,
            type: accountType,
            label: accountLabel,
            owner: accountId,
            money: Number(data.money ?? 0),
            marked_money: Number(data.marked_money ?? 0),
            maxCapacity: accountMaxCapacity,
            coords: data.coords ? [coords.x, coords.y] : null,
        };
    }
}
