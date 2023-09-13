import { emitRpc } from '../../core/rpc';
import { RepositoryConfig, RepositoryType } from '../../shared/repository';
import { RpcServerEvent } from '../../shared/rpc';

export abstract class Repository<
    T extends keyof RepositoryConfig,
    K extends keyof RepositoryConfig[T] = keyof RepositoryConfig[T],
    V extends RepositoryConfig[T][K] = RepositoryConfig[T][K]
> {
    private data: Record<K, V> = {} as Record<K, V>;

    public abstract type: RepositoryType;

    async init(): Promise<void> {
        this.data = (await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA_2, this.type)) as Record<K, V>;
    }

    public delete(id: K): void {
        delete this.data[id];
    }

    public set(id: K, value: V): void {
        this.data[id] = value;
    }

    public find(id: K): V | null {
        return this.data[id] ?? this.data[id.toString()] ?? null;
    }

    public get(predicate?: (value: V, index: number, array: V[]) => T): V[] {
        const values = Object.values(this.data) as V[];

        if (predicate) {
            return values.filter(predicate);
        }

        return values;
    }
}
