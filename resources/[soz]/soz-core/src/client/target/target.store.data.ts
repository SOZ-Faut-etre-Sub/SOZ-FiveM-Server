import { Inject, Injectable } from '@core/decorators/injectable';
import { Logger } from '@core/logger';
import { TargetStoreBase } from '@public/client/target/target.store';

@Injectable()
export class TargetStoreData<E extends TargetStoreBase> {
    @Inject(Logger)
    private readonly logger: Logger;

    private data: Record<string, E> = {};

    public getAll(): Record<string, E> {
        return this.data;
    }

    public get(id: string): E {
        return this.data[id];
    }

    public find(predicate: (data: E) => boolean): E[] | undefined {
        return Object.values(this.data).filter(predicate);
    }

    public async add(id: string, data: E): Promise<boolean> {
        return new Promise(resolve => {
            for (const target of data.targets) {
                if (!target.action) {
                    this.logger.error('Target action is required');
                    resolve(false);
                    return;
                }

                if (!target.distance) {
                    target.distance = data.distance;
                }
            }

            if (!this.data[id]) {
                this.data[id] = data;
                resolve(true);
                return;
            }

            for (const target of data.targets) {
                if (this.data[id].targets.some(t => JSON.stringify(t) === JSON.stringify(target))) {
                    continue;
                }

                this.data[id].targets.push(target);
            }
            resolve(true);
        });
    }

    public remove(id: string): void {
        delete this.data[id];
    }

    public clear(): void {
        this.data = {};
    }
}
