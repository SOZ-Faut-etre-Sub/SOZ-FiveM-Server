import { Command } from '../../core/decorators/command';
import { Get } from '../../core/decorators/http';
import { Provider } from '../../core/decorators/provider';
import { Response } from '../../core/http/response';
import { TraceRegistry } from '../../core/profiler';
import { wait } from '../../core/utils';

@Provider()
export class MonitorTraceProvider {
    @Command('trace', { role: 'admin' })
    async startTracing(source: number, time: string) {
        TraceRegistry.start();

        const timeInMs = parseInt(time);

        console.log(`[TRACE] Starting trace for ${timeInMs}ms`);

        await wait(timeInMs);
        TraceRegistry.stop();

        console.log(`[TRACE] Ending trace`);
    }

    @Get('/traces', { auth: false })
    public async getTraces(): Promise<Response> {
        const traces = TraceRegistry.getTraces();

        return Response.json({
            traceEvents: traces,
        });
    }
}
