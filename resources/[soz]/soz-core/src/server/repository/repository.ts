export abstract class Repository<T> {
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

    protected abstract load(): Promise<T>;
}
