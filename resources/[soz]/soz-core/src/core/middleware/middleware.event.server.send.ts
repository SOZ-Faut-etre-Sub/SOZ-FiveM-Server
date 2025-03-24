import { Gauge, Histogram } from 'prom-client';

import { Injectable } from '../decorators/injectable';

@Injectable()
export class SendMiddlewareEventServer {
    private static eventHistogram: Histogram<string>;
    private static eventSizeGauge: Gauge<string>;

    public constructor() {
        SendMiddlewareEventServer.eventHistogram = new Histogram({
            name: 'soz_core_send_event',
            help: 'Send event execution histogram',
            labelNames: ['event', 'broadcast'],
        });

        SendMiddlewareEventServer.eventSizeGauge = new Gauge({
            name: 'soz_core_send_event_size',
            help: 'Send event size',
            labelNames: ['event', 'broadcast'],
        });

        if (!global.TriggerClientEventOrig) {
            global.TriggerClientEventOrig = global.TriggerClientEvent;
        }
        global.TriggerClientEvent = function (eventName: string, target: number | string, ...args: any[]) {
            const broadcast = target == -1 ? 1 : 0;
            const end = SendMiddlewareEventServer.eventHistogram.startTimer({
                event: eventName,
                broadcast,
            });

            const playerCount = target == -1 ? GetNumPlayerIndices() : 1;
            // this is not the real size, but it's good enough to compare
            const size = Buffer.byteLength(JSON.stringify(args)) * playerCount;

            SendMiddlewareEventServer.eventSizeGauge.inc({ event: eventName, broadcast }, size);

            global.TriggerClientEventOrig(eventName, target, ...args);

            end();
        };

        if (!global.TriggerLatentClientEventOrig) {
            global.TriggerLatentClientEventOrig = global.TriggerLatentClientEvent;
        }
        global.TriggerLatentClientEvent = function (
            eventName: string,
            target: number | string,
            bps: number,
            ...args: any[]
        ) {
            const fixedEventName = eventName.replace(
                /_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g,
                ''
            );
            const broadcast = target == -1 ? 1 : 0;
            const end = SendMiddlewareEventServer.eventHistogram.startTimer({
                event: fixedEventName,
                broadcast,
            });
            const playerCount = target == -1 ? GetNumPlayerIndices() : 1;
            // this is not the real size, but it's good enough to compare
            const size = Buffer.byteLength(JSON.stringify(args)) * playerCount;

            SendMiddlewareEventServer.eventSizeGauge.inc({ event: fixedEventName, broadcast }, size);

            global.TriggerLatentClientEventOrig(eventName, target, bps, ...args);

            end();
        };
    }
}
