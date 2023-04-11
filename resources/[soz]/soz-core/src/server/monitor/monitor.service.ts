import { Histogram } from 'prom-client';

import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class MonitorService {
    private callDurationHistogram: Histogram<string> = new Histogram({
        name: 'soz_core_call',
        help: 'Http route execution histogram',
        labelNames: ['name'],
    });

    public async doCall<T>(name: string, callback: () => T | Promise<T>): Promise<T> {
        const end = this.callDurationHistogram.startTimer({
            name,
        });
        const result = await callback();

        end();

        return result;
    }
}
