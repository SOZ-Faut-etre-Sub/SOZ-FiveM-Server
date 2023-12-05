let traceId = 0;

export type AsyncTraceEvent = {
    cat: string;
    name: string;
    ts: number;
    id?: number;
    ph: 'b' | 'n' | 'e' | 'M';
    args?: any;
    pid?: number;
    tid?: number;
};

export class AsyncTrace {
    private readonly cat: string;
    private readonly id: number;
    private readonly type: 'event' | 'tick';

    public constructor(cat: string, type: 'event' | 'tick') {
        this.cat = `blink.user_timing,${cat}`;
        this.id = traceId;
        this.type = type;

        traceId++;
    }

    public start(name: string, init = false): void {
        TraceRegistry.register(
            {
                cat: this.cat,
                name,
                ph: 'b',
                id: this.id,
            },
            this.type,
            init
        );
    }

    public instant(name: string): void {
        TraceRegistry.register(
            {
                cat: this.cat,
                name,
                ph: 'n',
                id: this.id,
            },
            this.type
        );
    }

    public stop(name: string): void {
        TraceRegistry.register(
            {
                cat: this.cat,
                name,
                ph: 'e',
                id: this.id,
            },
            this.type
        );
    }
}

export class TraceRegistry {
    private static ts = 0;

    private static startTs = 0;

    private static traces: AsyncTraceEvent[] = [];

    private static running = false;

    private static ids: Set<number> = new Set<number>();

    public static start(): void {
        this.traces = [
            {
                args: {
                    name: 'Event',
                },
                cat: '__metadata',
                name: 'process_name',
                ph: 'M',
                pid: 1,
                tid: 1,
                ts: 0,
            },
            {
                args: {
                    name: 'Tick',
                },
                cat: '__metadata',
                name: 'process_name',
                ph: 'M',
                pid: 2,
                tid: 2,
                ts: 0,
            },
        ];
        this.running = true;
        this.ts = 0;
        this.startTs = GetGameTimer();
        this.ids = new Set<number>();
    }

    public static stop(): void {
        this.running = false;
    }

    public static register(trace: Omit<AsyncTraceEvent, 'ts'>, type: 'event' | 'tick', init = false): void {
        if (!this.running) {
            return;
        }

        if (!init && !this.ids.has(trace.id)) {
            return;
        }

        if (init) {
            this.ids.add(trace.id);
        }

        this.traces.push({
            ...trace,
            pid: type === 'event' ? 1 : 2,
            tid: type === 'event' ? 1 : 2,
            ts: (GetGameTimer() - this.startTs) * 1000,
        });
    }

    public static getTraces(): AsyncTraceEvent[] {
        return this.traces;
    }
}
