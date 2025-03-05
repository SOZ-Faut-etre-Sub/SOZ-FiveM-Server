import { Gauge } from 'prom-client';

import { Injectable } from '../decorators/injectable';

@Injectable()
export class SendMiddlewareStatebagServer {
    private static eventGauge: Gauge<string>;

    public constructor() {
        SendMiddlewareStatebagServer.eventGauge = new Gauge({
            name: 'soz_core_statebag',
            help: 'Statebag Change Gauge',
            labelNames: ['bagName', 'key', 'replicated'],
        });

        AddStateBagChangeHandler(
            null,
            null,
            function (bagName: string, key: string, value: any, reserved: number, replicated: boolean) {
                SendMiddlewareStatebagServer.eventGauge.inc({
                    bagName,
                    key,
                    replicated: replicated ? 1 : 0,
                });
            }
        );
    }
}
