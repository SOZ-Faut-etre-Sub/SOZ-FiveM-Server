import { Module } from '../../core/decorators/module';
import { MonitorBankProvider } from './monitor.bank.provider';
import { MonitorClickhouseProvider } from './monitor.clickhouse.provider';
import { MonitorFieldProvider } from './monitor.field.provider';
import { MonitorPlayerProvider } from './monitor.player.provider';
import { MonitorPositionProvider } from './monitor.position.provider';
import { MonitorProvider } from './monitor.provider';
import { MonitorTraceProvider } from './monitor.trace.provider';
import { MonitorUpwProvider } from './monitor.upw.provider';

@Module({
    providers: [
        MonitorProvider,
        MonitorBankProvider,
        MonitorUpwProvider,
        MonitorFieldProvider,
        MonitorPlayerProvider,
        MonitorPositionProvider,
        MonitorTraceProvider,
        MonitorClickhouseProvider,
    ],
})
export class MonitorModule {}
