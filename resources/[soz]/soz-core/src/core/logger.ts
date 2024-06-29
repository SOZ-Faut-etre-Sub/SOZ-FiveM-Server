import { LogEvent } from '@public/shared/monitor';

import { SOZ_CORE_IS_PRODUCTION } from '../globals';
import { Inject, Injectable } from './decorators/injectable';

enum LogColor {
    Red = 1,
    Green = 2,
    Yellow = 3,
    Blue = 4,
    Magenta = 5,
    Cyan = 6,
    White = 7,
}

export enum LogLevel {
    Debug = 'DEBUG',
    Info = 'INFO',
    Warn = 'WARN',
    Error = 'ERROR',
}

const LogLevelOrder: Record<LogLevel, number> = {
    [LogLevel.Debug]: 0,
    [LogLevel.Info]: 1,
    [LogLevel.Warn]: 2,
    [LogLevel.Error]: 3,
};

export const shouldLog = (level: LogLevel, minLevel: LogLevel): boolean => {
    return LogLevelOrder[level] >= LogLevelOrder[minLevel];
};

export interface LogHandler {
    write(level: LogLevel, message: string, extra: Partial<LogEvent>): void;
}

@Injectable()
export class LogConsoleHandler implements LogHandler {
    private level: LogLevel = LogLevel.Debug;

    public constructor() {
        if (SOZ_CORE_IS_PRODUCTION) {
            this.level = LogLevel.Info;
        }
    }

    private format(color: LogColor, ...message: string[]): string {
        return `^${color.valueOf().toString()}[${new Date().toISOString()}] ${message.join(' ')}^7`;
    }

    public write(level: LogLevel, message: string, extra: Partial<LogEvent>): void {
        if (shouldLog(level, this.level)) {
            console.log(this.format(levelToColors[level], message, JSON.stringify(extra)));
        }
    }
}

@Injectable()
export class LogChainHandler implements LogHandler {
    private handlers: LogHandler[] = [];

    public constructor(@Inject(LogConsoleHandler) consoleHandler: LogConsoleHandler) {
        this.handlers.push(consoleHandler);
    }

    public addHandler(handler: LogHandler): void {
        this.handlers.push(handler);
    }

    public write(level: LogLevel, message: string, extra: Partial<LogEvent>): void {
        for (const handler of this.handlers) {
            handler.write(level, message, extra);
        }
    }
}

const levelToColors = {
    [LogLevel.Debug]: LogColor.White,
    [LogLevel.Info]: LogColor.Blue,
    [LogLevel.Warn]: LogColor.Yellow,
    [LogLevel.Error]: LogColor.Red,
};

@Injectable()
export class Logger {
    @Inject(LogChainHandler)
    private handler: LogChainHandler;

    public format(...message: string[]): string {
        return message.join(' ');
    }

    public info(message: string, extra: Partial<LogEvent> = {}): void {
        this.write(LogLevel.Info, message, extra);
    }

    public debug(message: string, extra: Partial<LogEvent> = {}): void {
        this.write(LogLevel.Debug, message, extra);
    }

    public warn(message: string, extra: Partial<LogEvent> = {}): void {
        this.write(LogLevel.Warn, message, extra);
    }

    public error(message: string, extra: Partial<LogEvent> = {}): void {
        this.write(LogLevel.Error, message, extra);
    }

    public log(level: LogLevel, message: string, extra: Partial<LogEvent> = {}): void {
        this.write(level, message, extra);
    }

    private write(level: LogLevel, message: string, extra: Partial<LogEvent> = {}): void {
        this.handler.write(level, message, extra);
    }
}

export const StaticLogger = new Logger();
