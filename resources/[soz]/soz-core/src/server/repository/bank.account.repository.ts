import { Inject, Injectable } from '../../core/decorators/injectable';
import { BankAccount } from '../../shared/bank';
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

    public type = RepositoryType.BankAccount;

    protected async load(): Promise<Record<string, BankAccount>> {
        const result = await this.prismaService.bank_accounts.findMany();
        const accounts = {};

        result.forEach(account => {
            let accountId = account.accountid;
            let accountType = account.account_type;
            let accountLabel = account.citizenid;
            const coords = JSON.parse(account.coords) as { x: number; y: number };

            accounts[accountId] = {};

            switch (account.account_type) {
                case 'business':
                    accountId = account.businessid;
                    accountLabel = this.jobService.getJob(accountId as JobType).label;
                    break;
                case 'safestorages':
                    if (account.houseid) {
                        accountId = account.houseid;
                        accountType = 'house_safe';
                        accountLabel = account.houseid;
                        break;
                    }
                    accountId = account.businessid;
                    accountLabel = 'Coffre-fort';
                    break;
            }

            accounts[accountId] = {
                id: accountId,
                type: accountType,
                label: accountLabel,
                owner: accountId,
                money: Number(account.money),
                markedMoney: Number(account.marked_money),
                coords: account.coords ? [coords.x, coords.y] : null,
            };
        });

        return accounts;
    }
}
