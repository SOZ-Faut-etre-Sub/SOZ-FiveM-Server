import { Injectable } from '@core/decorators/injectable';
import { uuidv4 } from '@core/utils';
import { TargetStoreBase } from '@public/client/target/target.store';

@Injectable()
export class TargetStoreData<E extends TargetStoreBase> {
    private data: Record<string, E> = {};

    public getAll(): [string, E][] {
        return Object.entries(this.data);
    }

    public get(key: string): E {
        return this.data[key];
    }

    public find(predicate: (value: [string, E]) => boolean): [string, E][] | undefined {
        return Object.entries(this.data).filter(predicate);
    }

    public add(data: E, id?: string): string {
        if (!id) {
            id = uuidv4();
        }

        for (const target of data.targets) {
            if (!target.action) {
                console.error('Target action is required');
                return;
            }

            if (!target.distance) {
                target.distance = data.distance;
            }
        }

        this.data[id] = data;
        return id;
    }

    public remove(key: string): void {
        delete this.data[key];
    }

    public clear(): void {
        this.data = {};
    }
}
