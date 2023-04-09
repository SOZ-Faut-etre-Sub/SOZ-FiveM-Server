import { Gauge } from 'prom-client';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';

type UpwMetrics = {
    pollution_level: number;
    pollution_percent: number;
    blackout_level: number;
    blackout_percent: number;
    facilities: {
        type: string;
        identifier: string;
        value: number;
        job?: string;
        scope: string;
    }[];
};

@Provider()
export class MonitorUpwProvider {
    private blackoutPercent: Gauge<string> = new Gauge({
        name: 'soz_upw_blackout_percent',
        help: 'Pollution level percent',
    });

    private blackoutLevel: Gauge<string> = new Gauge({
        name: 'soz_upw_blackout_level',
        help: 'Pollution level',
    });

    private pollutionPercent: Gauge<string> = new Gauge({
        name: 'soz_upw_pollution_percent',
        help: 'Pollution level percent',
    });

    private pollutionLevel: Gauge<string> = new Gauge({
        name: 'soz_upw_pollution_level',
        help: 'Pollution level',
    });

    private facilities: Gauge<string> = new Gauge({
        name: 'soz_upw_facility',
        help: 'Energy available in a facility',
        labelNames: ['type', 'identifier', 'job', 'scope'],
    });

    @Tick(5000, 'monitor:upw:metrics')
    public async onTick() {
        const metrics = exports['soz-upw'].GetMetrics() as UpwMetrics;

        this.blackoutPercent.set(metrics.blackout_percent);
        this.blackoutLevel.set(metrics.blackout_level);
        this.pollutionPercent.set(metrics.pollution_percent);
        this.pollutionLevel.set(metrics.pollution_level);

        for (const facility of metrics.facilities) {
            const labels = {
                type: facility.type,
                identifier: facility.identifier,
            } as any;

            if (facility.job) {
                labels.job = facility.job;
            }

            if (facility.scope) {
                labels.scope = facility.scope;
            }

            this.facilities.set(labels, facility.value);
        }
    }
}
