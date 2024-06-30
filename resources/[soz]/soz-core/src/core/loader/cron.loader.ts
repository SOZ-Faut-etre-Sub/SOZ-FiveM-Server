import { differenceInMinutes } from 'date-fns';

import { CronMetadata, CronMetadataKey } from '../decorators/cron';
import { Inject, Injectable } from '../decorators/injectable';
import { getMethodMetadata } from '../decorators/reflect';
import { Logger } from '../logger';

type Job = {
    metadata: CronMetadata;
    method: (...args) => Promise<void>;
    lastRun?: Date;
};

@Injectable()
export class CronLoader {
    private jobs: Job[] = [];

    @Inject(Logger)
    private logger: Logger;

    private tick;

    public constructor() {
        this.tick = setInterval(this.run.bind(this), 60_000);
    }

    public load(provider): void {
        const cronMethodList = getMethodMetadata<CronMetadata>(CronMetadataKey, provider);

        for (const methodName of Object.keys(cronMethodList)) {
            const metadata = cronMethodList[methodName];
            const method = provider[methodName].bind(provider);

            const decoratedMethod = async (...args) => {
                try {
                    await method(...args);
                } catch (e) {
                    this.logger.error(
                        `Error on executing cron at ${metadata.hour}:${metadata.minute} in method ${methodName} of provider ${provider.constructor.name}: ${e} ${e.stack}`
                    );
                }
            };

            this.logger.debug(
                `Cron job loaded at ${metadata.hour}:${metadata.minute} in method ${methodName} of provider ${provider.constructor.name}`
            );

            this.jobs.push({
                metadata,
                method: decoratedMethod,
            });
        }
    }

    public async run() {
        const now = new Date();

        for (const job of this.jobs) {
            if (job.metadata.dayOfWeek && job.metadata.dayOfWeek !== now.getDay()) {
                continue;
            }

            const runDate = new Date();
            runDate.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
            runDate.setHours(job.metadata.hour);
            runDate.setMinutes(job.metadata.minute);
            const delta = differenceInMinutes(now, runDate);

            if (0 <= delta && delta < 5) {
                if (!job.lastRun || differenceInMinutes(now, job.lastRun) > 5) {
                    await job.method();

                    job.lastRun = now;
                }
            }
        }
    }

    public unload(): void {
        clearInterval(this.tick);
        this.jobs = [];
    }
}
