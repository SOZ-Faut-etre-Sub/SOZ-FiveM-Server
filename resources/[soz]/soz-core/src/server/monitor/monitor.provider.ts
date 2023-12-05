import { collectDefaultMetrics, register } from 'prom-client';

import { OnEvent } from '../../core/decorators/event';
import { Get } from '../../core/decorators/http';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Response } from '../../core/http/response';
import { ServerEvent } from '../../shared/event';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class MonitorProvider {
    @Inject(PrismaService)
    private readonly prisma: PrismaService;

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
        const prismaMetrics = await this.prisma.$metrics.prometheus();
        const metrics = (await register.metrics()) + this.clientMetrics.join('\n') + prismaMetrics;
        this.clientMetrics = [];

        return Response.ok(metrics);
    }
}
