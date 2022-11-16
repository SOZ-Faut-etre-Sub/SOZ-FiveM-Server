export abstract class Repository<T> {
    private data: T | null;

    public async init() {
        this.data = await this.load();
    }

    public async refresh(): Promise<T> {
        this.data = await this.load();

        return this.data;
    }

    public get(): T | null {
        return this.data;
    }

    protected abstract load(): Promise<T>;
}
