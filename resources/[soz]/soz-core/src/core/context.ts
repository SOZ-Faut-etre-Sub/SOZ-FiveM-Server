import { AsyncTrace } from './profiler';
import { wait } from './utils';

export class Context {
    private readonly name: string;

    private readonly type: 'event' | 'tick';

    private asyncTrace: AsyncTrace;

    public constructor(name: string, type: 'event' | 'tick') {
        this.name = name;
        this.type = type;
        this.asyncTrace = new AsyncTrace(`${this.name}`, this.type);
    }

    public async trace<T>(name: string, callback: () => Promise<T>): Promise<T> {
        this.asyncTrace.start(name);

        try {
            return await callback();
        } finally {
            this.asyncTrace.stop(name);
        }
    }

    public wait(ms: number): Promise<boolean> {
        return this.trace('wait', async () => await wait(ms));
    }

    public start(): void {
        this.asyncTrace.start(this.name, true);
    }

    public stop(): void {
        this.asyncTrace.stop(this.name);
    }
}
