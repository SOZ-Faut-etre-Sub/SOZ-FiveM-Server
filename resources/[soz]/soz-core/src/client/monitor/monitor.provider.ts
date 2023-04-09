import { collectDefaultMetrics, register } from 'prom-client';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ServerEvent } from '../../shared/event';

@Provider()
export class MonitorProvider {
    public constructor() {}

    @Tick(5000)
    async collectMetrics() {
        const metrics = await register.metrics();

        TriggerServerEvent(ServerEvent.METRICS_UPDATE, metrics);
    }
}
