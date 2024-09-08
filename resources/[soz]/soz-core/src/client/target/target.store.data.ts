import { Injectable } from '@core/decorators/injectable';
import { TargetStoreBase } from '@public/client/target/target.store';

@Injectable()
export class TargetStoreData<E extends TargetStoreBase> {
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

    public add(id: string, data: E): void {
        if (!this.data[id]) {
            this.data[id] = data;
            return;
        }

        for (const target of data.targets) {
            if (!this.data[id].targets.find(t => t.label === target.label)) {
                this.data[id].targets.push(target);
            }
        }
    }

    public remove(id: string): void {
        delete this.data[id];
    }

    public clear(): void {
        this.data = {};
    }
}
