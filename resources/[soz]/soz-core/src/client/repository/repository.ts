import { Inject } from '@core/decorators/injectable';
import { RepositoryLoader } from '@core/loader/repository.loader';
import { emitRpc } from '@core/rpc';
import { applyPatch, Operation } from 'fast-json-patch';

import { RepositoryConfig, RepositoryMapping, RepositoryType } from '../../shared/repository';
import { RpcServerEvent } from '../../shared/rpc';

export abstract class Repository<
    T extends keyof RepositoryMapping,
    K extends keyof RepositoryConfig[T] = keyof RepositoryConfig[T],
    V = RepositoryMapping[T]
> {
    @Inject(RepositoryLoader)
    private repositoryLoader: RepositoryLoader;

    private data: Record<K, V> = {} as Record<K, V>;

    public abstract type: RepositoryType;

    public isInitialized = false;

    async init(): Promise<Record<K, V>> {
        this.data = (await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA_2, this.type)) as Record<K, V>;
        this.isInitialized = true;

        return this.data;
    }

    public patch(patch: Operation[]): Record<K, V> {
        const changedValues: Record<K, V> = {} as Record<K, V>;

        for (const operation of patch) {
            // get key from path
            const key = operation.path.split('/')[1] || null;

            if (key) {
                changedValues[key] = this.data[key] || null;
            }
        }

        applyPatch(this.data, patch);

        for (const key of Object.keys(changedValues)) {
            const previousValue = changedValues[key];
            const newValue = this.data[key] || null;

            if (previousValue === null) {
                this.repositoryLoader.trigger(this.type, 'insert', newValue);
            }

            if (newValue === null) {
                this.repositoryLoader.trigger(this.type, 'delete', previousValue);
            }

            if (previousValue !== null && newValue !== null) {
                this.repositoryLoader.trigger(this.type, 'update', newValue);
            }
        }

        return this.data;
    }

    public find(id: K): V | null {
        return this.data[id] ?? this.data[id.toString()] ?? null;
    }

    public get(predicate?: (value: V, index: number, array: V[]) => boolean): V[] {
        const values = Object.values(this.data) as V[];

        if (predicate) {
            return values.filter(predicate);
        }

        return values;
    }
}
