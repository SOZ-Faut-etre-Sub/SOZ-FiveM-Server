import { Injectable } from '@core/decorators/injectable';
import { LogHandler, LogLevel, shouldLog } from '@core/logger';

import { LokiEvent } from '../../shared/monitor';

@Injectable()
export class LokiLoggerHandler implements LogHandler {
    private buffer: LokiEvent[] = [];

    private lokiEndpoint: string = GetConvar('log_handler_loki', '');

    private logLevel: LogLevel = GetConvar('log_level', 'DEBUG').toUpperCase() as LogLevel;

    write(level: LogLevel, ...message: string[]): void {
        if (this.lokiEndpoint === '') {
            return;
        }

        if (!shouldLog(level, this.logLevel)) {
            return;
        }

        const timestamp = Date.now() * 1_000_000;

        const event: LokiEvent = {
            stream: {
                emitter: GetInvokingResource() || 'soz-core',
                level,
                agent: 'fivem',
                type: 'log',
            },
            values: [[String(timestamp), message.join(' ')]],
        };

        this.buffer.push(event);
    }

    public flush(): LokiEvent[] {
        const buffer = this.buffer;
        this.buffer = [];
        return buffer;
    }
}
