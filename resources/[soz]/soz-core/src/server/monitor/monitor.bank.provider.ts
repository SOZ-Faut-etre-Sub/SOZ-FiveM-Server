import { Gauge } from 'prom-client';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { BankAccount } from '../../shared/bank';
import { BankAccountRepository } from '../repository/bank.account.repository';
import { BankFarmRepository } from '../repository/bank.farm.repository';

@Provider()
export class MonitorBankProvider {
    @Inject(BankAccountRepository)
    private bankAccountRepository: BankAccountRepository;

    @Inject(BankFarmRepository)
    private bankFarmRepository: BankFarmRepository;

    private accountMoney: Gauge<string> = new Gauge({
        name: 'soz_bank_account_money',
        help: 'Amount of money in a bank account',
        labelNames: ['id', 'label', 'type', 'owner'],
    });

    private accountMarkedMoney: Gauge<string> = new Gauge({
        name: 'soz_bank_account_marked_money',
        help: 'Amount of marked money in a bank account',
        labelNames: ['id', 'label', 'type', 'owner'],
    });

    @Tick(5000, 'monitor:bank:metrics')
    public async onTick() {
        const bankAccounts = await this.bankAccountRepository.get();
        const farmAccounts = await this.bankFarmRepository.get();

        for (const account of [...bankAccounts, ...farmAccounts]) {
            this.updateMetrics(account);
        }
    }

    protected updateMetrics(account: Partial<BankAccount>) {
        const labels = {
            id: account.id,
            label: account.label,
            type: account.type,
            owner: account.owner,
        };

        this.accountMoney.set(labels, account.money);
        this.accountMarkedMoney.set(labels, account.marked_money);
    }
}
