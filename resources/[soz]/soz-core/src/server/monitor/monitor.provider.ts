import { collectDefaultMetrics, register } from 'prom-client';

import { OnEvent } from '../../core/decorators/event';
import { Get } from '../../core/decorators/http';
import { Provider } from '../../core/decorators/provider';
import { Response } from '../../core/http/response';
import { ServerEvent } from '../../shared/event';

@Provider()
export class MonitorProvider {
    private clientMetrics: string[] = [];

    public constructor() {
        collectDefaultMetrics({ prefix: 'soz_core_' });
    }

    @OnEvent(ServerEvent.METRICS_UPDATE)
    public onPlayerSendMetrics(source: number, metrics: string) {
        this.clientMetrics.push(metrics);
    }

    @Get('/metrics')
    public async getMetrics(): Promise<Response> {
        const metrics = (await register.metrics()) + this.clientMetrics.join('\n');
        this.clientMetrics = [];

        return Response.ok(metrics);
    }
}
