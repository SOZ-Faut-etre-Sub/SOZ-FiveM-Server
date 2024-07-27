import { FarmAccount } from '../../config/bank';
import { Injectable } from '../../core/decorators/injectable';
import { BankAccount } from '../../shared/bank';
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

    public removeMoney(accountId: string, money: number, moneyType: 'money' | 'marked_money' = 'money'): boolean {
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
