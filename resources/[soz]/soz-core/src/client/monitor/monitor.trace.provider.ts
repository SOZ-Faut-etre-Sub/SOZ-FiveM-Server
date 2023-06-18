import { Command } from '../../core/decorators/command';
import { Provider } from '../../core/decorators/provider';
import { TraceRegistry } from '../../core/profiler';
import { wait } from '../../core/utils';

@Provider()
export class MonitorTraceProvider {
    @Command('trace-export')
    async exportTrace() {
        const traces = TraceRegistry.getTraces();

        console.log(
            JSON.stringify({
                traceEvents: traces,
            })
        );
    }

    @Command('trace-client')
    async startPlayerTracing(source: number, time: string) {
        const timeInMs = parseInt(time);
        TraceRegistry.start();

        console.log(`[TRACE] Starting trace for ${timeInMs}ms`);

        await wait(timeInMs);
        TraceRegistry.stop();

        console.log(`[TRACE] Ending trace`);
    }
}
