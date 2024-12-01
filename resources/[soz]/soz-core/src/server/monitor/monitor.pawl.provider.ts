import { Gauge } from 'prom-client';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';

type PawlMetrics = {
    degradation_percent: number;
    fields: {
        identifier: string;
        value: number;
    }[];
};

@Provider()
export class MonitorPawlProvider {
    private degradationPercent: Gauge<string> = new Gauge({
        name: 'soz_pawl_degradation_percent',
        help: 'Degradation percent of pawl',
    });

    private field: Gauge<string> = new Gauge({
        name: 'soz_pawl_field',
        help: 'Number of tree in a pawl field',
        labelNames: ['identifier'],
    });

    @Tick(5000, 'monitor:pawl:metrics')
    public async onTick() {
        const metrics = exports['soz-pawl'].GetMetrics() as PawlMetrics;

        this.degradationPercent.set(metrics.degradation_percent);

        for (const field of metrics.fields) {
            this.field.set(
                {
                    identifier: field.identifier,
                },
                field.value
            );
        }
    }
}
