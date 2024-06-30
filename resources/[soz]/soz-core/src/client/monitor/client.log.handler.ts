import { Inject, Injectable } from '../../core/decorators/injectable';
import { LogHandler, LogLevel } from '../../core/logger';
import { LogEvent } from '../../shared/monitor';
import { Monitor } from './monitor';

@Injectable()
export class ClientLogHandler implements LogHandler {
    @Inject(Monitor)
    private readonly monitor: Monitor;

    write(level: LogLevel, message: string, extra: Partial<LogEvent> = {}): void {
        this.monitor.log(level, message, extra);
    }
}
