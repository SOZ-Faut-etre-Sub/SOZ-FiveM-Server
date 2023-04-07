import { Module } from '../../core/decorators/module';
import { MonitorProvider } from './monitor.provider';

@Module({
    providers: [MonitorProvider],
})
export class MonitorModule {}
