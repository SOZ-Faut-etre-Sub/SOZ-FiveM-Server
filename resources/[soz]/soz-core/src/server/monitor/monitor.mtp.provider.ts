import { Gauge } from 'prom-client';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';

type MtpMetrics = {
    field_percent: {
        identifier: string;
        value: number;
    }[];
};

@Provider()
export class MonitorMtpProvider {
    private fieldPercent: Gauge<string> = new Gauge({
        name: 'soz_mtp_field_percent',
        help: 'Field percent stored in MTP',
        labelNames: ['identifier'],
    });

    @Tick(5000, 'monitor:pawl:metrics')
    public async onTick() {
        const metrics = exports['soz-jobs'].GetMtpMetrics() as MtpMetrics;

        for (const field of metrics.field_percent) {
            this.fieldPercent.set(
                {
                    identifier: field.identifier,
                },
                field.value
            );
        }
    }
}
