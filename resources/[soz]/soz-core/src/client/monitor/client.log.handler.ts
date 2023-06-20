import { Inject, Injectable } from '../../core/decorators/injectable';
import { LogHandler, LogLevel } from '../../core/logger';
import { Monitor } from './monitor';

@Injectable()
export class ClientLogHandler implements LogHandler {
    @Inject(Monitor)
    private readonly monitor: Monitor;

    write(level: LogLevel, ...message: string[]): void {
        this.monitor.log(level, message.join(' '));
    }
}
