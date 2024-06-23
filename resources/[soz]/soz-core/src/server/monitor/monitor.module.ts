import { Module } from '../../core/decorators/module';
import { MonitorBankProvider } from './monitor.bank.provider';
import { MonitorFieldProvider } from './monitor.field.provider';
import { MonitorLokiProvider } from './monitor.loki.provider';
import { MonitorPawlProvider } from './monitor.pawl.provider';
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
        MonitorPawlProvider,
        MonitorFieldProvider,
        MonitorPlayerProvider,
        MonitorPositionProvider,
        MonitorTraceProvider,
        MonitorLokiProvider,
    ],
})
export class MonitorModule {}
