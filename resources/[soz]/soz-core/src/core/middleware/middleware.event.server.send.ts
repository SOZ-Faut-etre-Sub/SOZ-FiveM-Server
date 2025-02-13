import { Histogram } from 'prom-client';

import { Injectable } from '../decorators/injectable';

@Injectable()
export class SendMiddlewareEventServer {
    private static eventHistogram: Histogram<string>;

    public constructor() {
        SendMiddlewareEventServer.eventHistogram = new Histogram({
            name: 'soz_core_send_event',
            help: 'Send event execution histogram',
            labelNames: ['event'],
        });

        if (!global.TriggerClientEventOrig) {
            global.TriggerClientEventOrig = global.TriggerClientEvent;
            global.TriggerClientEvent = function (eventName: string, target: number | string, ...args: any[]) {
                const end = SendMiddlewareEventServer.eventHistogram.startTimer({
                    event: eventName,
                });
                global.TriggerClientEventOrig(eventName, target, ...args);

                end();
            };
        }

        if (!global.TriggerLatentClientEventOrig) {
            global.TriggerLatentClientEventOrig = global.TriggerLatentClientEvent;
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
                const end = SendMiddlewareEventServer.eventHistogram.startTimer({
                    event: fixedEventName,
                });
                global.TriggerLatentClientEventOrig(eventName, target, bps, ...args);

                end();
            };
        }
    }
}
