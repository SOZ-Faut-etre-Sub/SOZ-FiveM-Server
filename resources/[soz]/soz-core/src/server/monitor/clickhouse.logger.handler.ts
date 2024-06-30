import { Injectable } from '@core/decorators/injectable';
import { LogHandler, LogLevel, shouldLog } from '@core/logger';

import { LogEvent } from '../../shared/monitor';

@Injectable()
export class ClickhouseLoggerHandler implements LogHandler {
    private buffer: LogEvent[] = [];

    private logLevel: LogLevel = GetConvar('log_level', 'DEBUG').toUpperCase() as LogLevel;

    write(level: LogLevel, message: string, extra: Partial<LogEvent>): void {
        if (!shouldLog(level, this.logLevel)) {
            return;
        }

        const timestamp = Date.now();

        const event: LogEvent = {
            origin: 'server',
            ...extra,
            timestamp,
            level,
            message,
        };

        this.buffer.push(event);
    }

    public flush(): LogEvent[] {
        const buffer = this.buffer;
        this.buffer = [];
        return buffer;
    }
}
