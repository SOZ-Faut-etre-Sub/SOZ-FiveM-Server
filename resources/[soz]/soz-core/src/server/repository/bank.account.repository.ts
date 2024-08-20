import { bank_accounts } from '@prisma/client';
import { PlayerService } from '@public/server/player/player.service';
import { HousingRepository } from '@public/server/repository/housing.repository';
import { ClientEvent } from '@public/shared/event/client';
import { PlayerData } from '@public/shared/player';
import { toVector2Object, Vector3 } from '@public/shared/polyzone/vector';

import { AtmConfig, HouseSafeStorageTiers, SafeStorageMaxCapacity } from '../../config/bank';
import { Inject, Injectable } from '../../core/decorators/injectable';
import { AtmType, BankAccount, BankAccountType, BankAtmConfig, BankMoneyType } from '../../shared/bank';
import { JobPermission, JobType } from '../../shared/job';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';
import { Repository } from './repository';

@Injectable(BankAccountRepository, Repository)
export class BankAccountRepository extends Repository<RepositoryType.BankAccount> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerService)
    private playerService: PlayerService;

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
                accountid: accountId,
                account_type: accountType as any,
                money: this.getDefaultMoney(accountType, atmType),
                coords: coords ? JSON.stringify(toVector2Object(coords)) : null,
            },
        });

        this.data[accountId] = await this.serializeFromDatabase(data);

        return this.data[accountId];
    }

    public async addMoney(
        accountId: string,
        money: number,
        moneyType: BankMoneyType = 'money',
        allowOverflow: boolean = false
    ): Promise<boolean> {
        const account = this.data[accountId];
        if (!account) {
            return;
        }

        if (
            !allowOverflow &&
            (account.type === 'housestorages' || account.type === 'safestorages') &&
            account[moneyType] + money > account.maxCapacity
        ) {
            return false;
        }

        const bank_account = await this.prismaService.bank_accounts.update({
            where: { accountid: accountId },
            data: {
                [moneyType]: { increment: money },
            },
        });

        this.updatePlayerBalanceApp(bank_account);

        this.data[accountId][moneyType] = Number(bank_account[moneyType]);
        return true;
    }

    public async removeMoney(
        accountId: string,
        money: number,
        moneyType: BankMoneyType = 'money',
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
            where: { accountid: accountId },
            data: {
                [moneyType]: { decrement: money },
            },
        });

        this.updatePlayerBalanceApp(bank_account);

        this.data[accountId][moneyType] = Number(bank_account[moneyType]);
        return true;
    }

    public async clear(accountId: string): Promise<boolean> {
        const account = this.data[accountId];
        if (!account) {
            return;
        }

        const bank_account = await this.prismaService.bank_accounts.update({
            where: { accountid: accountId },
            data: {
                money: 0,
                marked_money: 0,
            },
        });

        this.updatePlayerBalanceApp(bank_account);

        this.data[accountId].money = 0;
        this.data[accountId].marked_money = 0;
        return true;
    }

    public async removeMoneyRatio(
        accountId: string,
        ratio: number,
        moneyType: BankMoneyType = 'money'
    ): Promise<boolean> {
        const account = this.data[accountId];
        if (!account) {
            return;
        }

        const bank_account = await this.prismaService.bank_accounts.update({
            where: { accountid: accountId },
            data: {
                [moneyType]: { multiply: ratio },
            },
        });

        this.data[accountId][moneyType] = Number(bank_account[moneyType]);

        return true;
    }

    public async hasAccessToAccount(player: PlayerData, account: BankAccount): Promise<boolean> {
        if (account.type === 'safestorages' || account.type === 'business') {
            if (
                !(await this.jobService.hasTargetJobPermission(
                    account.id.replace('safe_', '') as JobType,
                    player.job.id,
                    Number(player.job.grade),
                    JobPermission.SocietyMoneyStorage
                ))
            ) {
                return false;
            }
        }

        return true;
    }

    public async refreshAccount(accountId: string): Promise<void> {
        const account = await this.prismaService.bank_accounts.findUnique({
            where: { accountid: accountId },
        });
        if (!account) return;

        this.data[accountId] = await this.serializeFromDatabase(account);
    }

    protected getDefaultMoney(type: BankAccountType, atmType?: AtmType): number {
        switch (type) {
            case 'player':
                return 5_000;
            case 'business':
                return 200_000;
            case 'bank_atm':
                return AtmConfig[atmType]?.maxMoney ?? 0;
            default:
                return 0;
        }
    }

    protected getAtmConfig(accountId: string): BankAtmConfig {
        const bankType = accountId.match(/bank_(\D+)/)?.[1] as string;
        const atmType = accountId.match(/atm_(\w+)_([\w-]+)/)?.[1] as string;

        if (bankType) {
            return { ...AtmConfig[bankType], type: bankType as AtmType };
        }

        if (atmType) {
            return { ...AtmConfig[atmType], type: atmType as AtmType };
        }

        return null;
    }

    protected updatePlayerBalanceApp(account: bank_accounts): void {
        if (account.account_type !== 'player') return;

        const player = this.playerService.getPlayerByBankAccount(account.accountid);
        if (player) {
            TriggerClientEvent(
                ClientEvent.PHONE_APP_BANK_UPDATE_BALANCE,
                player.source,
                `${player.charinfo.firstname} ${player.charinfo.lastname}`,
                account.accountid,
                Number(account.money)
            );
        }
    }

    protected async serializeFromDatabase(data: bank_accounts): Promise<BankAccount> {
        let accountType: BankAccountType = data.account_type as any;
        let accountLabel = data.accountid;
        let accountMaxCapacity = null;

        const coords = JSON.parse(data.coords) as { x: number; y: number };
        const society = this.jobService.getJob(data.accountid?.replace(/[a-z]+_/, '') as JobType);
        const safeStorageLabel = `Coffre ${this.jobService.getJob(data.accountid?.replace(/safe_/, '') as JobType)?.label}`;
        const apartment = await this.housingRepository.getApartmentByIdentifier(data.accountid);

        switch (data.account_type) {
            case 'player':
                accountLabel = await this.playerService.getNameFromBankAccount(data.accountid);
                break;
            case 'business':
                accountLabel = this.jobService.getJob(data.accountid as JobType)?.label ?? data.accountid;
                break;
            case 'housestorages':
                if (apartment) {
                    accountLabel = apartment.label;
                    accountMaxCapacity = HouseSafeStorageTiers[apartment.money_tier ?? 0];
                }

                break;
            case 'safestorages':
                accountLabel = safeStorageLabel;
                accountMaxCapacity = SafeStorageMaxCapacity;
                break;
            case 'offshore':
                accountLabel = society?.label ?? data.accountid;
                break;
            case 'bank_atm':
                accountType = 'bank_atm';
                accountLabel = safeStorageLabel;
                break;
        }

        return {
            id: data.accountid,
            type: accountType,
            label: accountLabel,
            owner: data.accountid,
            money: Number(data.money ?? 0),
            marked_money: Number(data.marked_money ?? 0),
            maxCapacity: accountMaxCapacity,
            coords: data.coords ? [coords.x, coords.y] : null,
            config: this.getAtmConfig(data.accountid),
        };
    }
}
