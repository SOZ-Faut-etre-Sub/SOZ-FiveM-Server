import { Module } from '../../core/decorators/module';
import { MonitorTraceProvider } from './monitor.trace.provider';

@Module({
    providers: [MonitorTraceProvider],
})
export class MonitorModule {}
