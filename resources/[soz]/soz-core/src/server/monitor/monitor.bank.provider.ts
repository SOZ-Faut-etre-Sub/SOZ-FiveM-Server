import { Gauge } from 'prom-client';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';

type BankMetrics = {
    id: string;
    label: string;
    type: string;
    owner: string;
    money: number;
    marked_money: number;
};

@Provider()
export class MonitorBankProvider {
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
        const metrics = exports['soz-bank'].GetMetrics() as BankMetrics[];

        for (const metric of metrics) {
            const labels = {
                id: metric.id,
                label: metric.label,
                type: metric.type,
                owner: metric.owner,
            };

            this.accountMoney.set(labels, metric.money);
            this.accountMarkedMoney.set(labels, metric.marked_money);
        }
    }
}
