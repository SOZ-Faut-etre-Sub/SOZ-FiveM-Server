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

    @Command('sampling-profiler-server', { role: 'admin' })
    async startSamplingProfiler(source: number, time: string) {
        const timeInMs = parseInt(time);
        Citizen.startProfiling();

        console.log(`[TRACE] Starting profiling for ${timeInMs}ms`);

        await wait(timeInMs);
        const str = Citizen.stopProfiling();

        SaveResourceFile('soz-core', 'profiling', JSON.stringify(str), -1);

        console.log(`[TRACE] Ending profiling`);
    }
}
