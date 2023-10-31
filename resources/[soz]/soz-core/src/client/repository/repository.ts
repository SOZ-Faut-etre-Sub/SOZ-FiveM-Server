import { Inject } from '../../core/decorators/injectable';
import { RepositoryLoader } from '../../core/loader/repository.loader';
import { emitRpc } from '../../core/rpc';
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

    async init(): Promise<void> {
        this.data = (await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA_2, this.type)) as Record<K, V>;
    }

    public delete(id: K): void {
        const value = this.data[id];

        if (!value) {
            return;
        }

        delete this.data[id];

        this.repositoryLoader.trigger(this.type, 'delete', value);
    }

    public set(id: K, value: V): void {
        const add = !this.data[id];
        this.data[id] = value;

        if (add) {
            this.repositoryLoader.trigger(this.type, 'insert', value);
        } else {
            this.repositoryLoader.trigger(this.type, 'update', value);
        }
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
