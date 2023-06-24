import { Module } from '../../core/decorators/module';
import { Monitor } from './monitor';
import { MonitorLogProvider } from './monitor.log.provider';
import { MonitorTraceProvider } from './monitor.trace.provider';

@Module({
    providers: [MonitorLogProvider, MonitorTraceProvider, Monitor],
})
export class MonitorModule {}
