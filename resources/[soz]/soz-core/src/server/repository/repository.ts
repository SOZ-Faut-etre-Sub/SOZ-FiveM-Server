import { RepositoryConfig, RepositoryType } from '@public/shared/repository';
import { applyPatch, compare, generate, observe, Observer } from 'fast-json-patch';

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
    private observer: Observer<Record<K, V>> = null;

    public constructor() {
        this.loadPromise = new Promise(resolve => {
            this.loadResolve = resolve;
        });
    }

    public async init(): Promise<Record<K, V>> {
        this.data = await this.load();
        this.observer = observe(this.data);

        // normalize data
        const patch = generate(this.observer);
        applyPatch(this.data, patch);

        this.loadResolve();
        this.loadPromise = null;

        return this.data;
    }

    public async refresh(): Promise<Record<K, V>> {
        const data = await this.load();

        const patch = compare(this.data, data);
        applyPatch(this.data, patch);

        return this.data;
    }

    public delete(id: K): void {
        delete this.data[id];
    }

    public async set(id: K, value: V): Promise<void> {
        if (this.loadPromise) {
            await this.loadPromise;
        }

        this.data[id] = value;
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

    public async get(predicate?: (value: V, index: number, array: V[]) => boolean): Promise<V[]> {
        if (this.loadPromise) {
            await this.loadPromise;
        }

        const values = Object.values(this.data) as V[];

        if (predicate) {
            return values.filter(predicate);
        }

        return values;
    }

    public observe() {
        if (!this.observer) {
            return [];
        }

        return generate(this.observer);
    }

    protected abstract load(): Promise<Record<K, V>>;
}
