import { ClientEvent } from '@public/shared/event';
import { RepositoryConfig, RepositoryType } from '@public/shared/repository';

export abstract class RepositoryLegacy<T> {
    private data: T | null;

    private loadPromise: Promise<void> | null = null;
    private loadResolve: () => void;

    public constructor() {
        this.loadPromise = new Promise(resolve => {
            this.loadResolve = resolve;
        });
    }

    public async init() {
        this.data = await this.load();
        this.loadResolve();
        this.loadPromise = null;
    }

    public async refresh(): Promise<T> {
        this.data = await this.load();

        return this.data;
    }

    public async get(): Promise<T | null> {
        if (this.loadPromise) {
            await this.loadPromise;
        }

        return this.data;
    }

    public async set(data: T) {
        this.data = data;
    }

    protected abstract load(): Promise<T>;
}

export abstract class Repository<
    T extends keyof RepositoryConfig,
    K extends keyof RepositoryConfig[T] = keyof RepositoryConfig[T],
    V extends RepositoryConfig[T][K] = RepositoryConfig[T][K]
> {
    public abstract type: RepositoryType;

    protected data: Record<K, V>;

    private loadPromise: Promise<void> | null = null;
    private loadResolve: () => void;

    public constructor() {
        this.loadPromise = new Promise(resolve => {
            this.loadResolve = resolve;
        });
    }

    public async init() {
        this.data = await this.load();
        this.loadResolve();
        this.loadPromise = null;
    }

    public async delete(id: K): Promise<void> {
        delete this.data[id];

        TriggerClientEvent(ClientEvent.REPOSITORY_DELETE_DATA, -1, this.type, id);
    }

    public async set(id: K, value: V): Promise<void> {
        if (this.loadPromise) {
            await this.loadPromise;
        }

        this.data[id] = value;
        this.sync(id);
    }

    public async find(id: K): Promise<V | null> {
        if (this.loadPromise) {
            await this.loadPromise;
        }

        return this.data[id] ?? null;
    }

    public async raw(): Promise<Record<K, V>> {
        if (this.loadPromise) {
            await this.loadPromise;
        }

        return this.data;
    }

    public async get(predicate?: (value: V, index: number, array: V[]) => T): Promise<V[]> {
        if (this.loadPromise) {
            await this.loadPromise;
        }

        const values = Object.values(this.data) as V[];

        if (predicate) {
            return values.filter(predicate);
        }

        return values;
    }

    protected sync(key: K) {
        TriggerClientEvent(ClientEvent.REPOSITORY_SET_DATA, -1, this.type, key, this.data[key]);
    }

    protected abstract load(): Promise<Record<K, V>>;
}
