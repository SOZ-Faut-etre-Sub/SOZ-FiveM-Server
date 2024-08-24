import { FarmAccount } from '../../config/bank';
import { Injectable } from '../../core/decorators/injectable';
import { BankAccount, BankMoneyType } from '../../shared/bank';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(BankFarmRepository, Repository)
export class BankFarmRepository extends Repository<RepositoryType.BankFarmAccount> {
    public type = RepositoryType.BankFarmAccount;

    protected async load(): Promise<Record<string, Partial<BankAccount>>> {
        const accounts: Record<string, Partial<BankAccount>> = {};

        Object.entries(FarmAccount).forEach(([id, data]) => {
            accounts[id] = {
                id,
                money: data.money,
                marked_money: data.marked_money ?? 0,
            };
        });

        return accounts;
    }

    public async findOrCreate(accountId: string): Promise<Partial<BankAccount>> {
        let account = this.data[accountId];
        if (!account) {
            account = {
                id: accountId,
                money: 0,
                marked_money: 0,
            };

            this.data[accountId] = account;
        }

        return account;
    }

    public addMoney(accountId: string, money: number, moneyType: BankMoneyType = 'money'): boolean {
        const account = this.data[accountId];
        if (!account) {
            return false;
        }

        account[moneyType] += money;
        return true;
    }

    public removeMoney(accountId: string, money: number, moneyType: BankMoneyType = 'money'): boolean {
        const account = this.data[accountId];
        if (!account) {
            return false;
        }

        if (account[moneyType] < money) {
            return false;
        }

        account[moneyType] -= money;
        return true;
    }
}
