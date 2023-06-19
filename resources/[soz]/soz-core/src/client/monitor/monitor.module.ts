import { Module } from '../../core/decorators/module';
import { Monitor } from './monitor';
import { MonitorTraceProvider } from './monitor.trace.provider';

@Module({
    providers: [MonitorTraceProvider, Monitor],
})
export class MonitorModule {}
