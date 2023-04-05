import { SOZ_CORE_IS_PRODUCTION } from '../globals';
import { Injectable } from './decorators/injectable';

enum LogColor {
    Red = 1,
    Green = 2,
    Yellow = 3,
    Blue = 4,
    Magenta = 5,
    Cyan = 6,
    White = 7,
}

enum LogLevel {
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
}

@Injectable()
export class Logger {
    private level: LogLevel = LogLevel.Debug;

    public constructor() {
        if (SOZ_CORE_IS_PRODUCTION) {
            this.level = LogLevel.Info;
        }
    }

    public info(...message: string[]): void {
        this.write(LogLevel.Info, this.format(LogColor.White, ...message));
    }

    public debug(...message: string[]): void {
        this.write(LogLevel.Debug, this.format(LogColor.Blue, ...message));
    }

    public warn(...message: string[]): void {
        this.write(LogLevel.Warn, this.format(LogColor.Yellow, ...message));
    }

    public error(...message: string[]): void {
        this.write(LogLevel.Error, this.format(LogColor.Red, ...message));
    }

    private format(color: LogColor, ...message: string[]): string {
        return `^${color.valueOf().toString()}[${new Date().toLocaleString()}] ${message.join(' ')}^7`;
    }

    private write(level: LogLevel, message: string) {
        if (this.level <= level) {
            console.log(message);
        }
    }
}
