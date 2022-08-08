import winston from 'winston';

import config from '../../config.json';

// Needed to manually apply a color to componenent property of log
const manualColorize = (strToColor: string): string => `[\x1b[35m${strToColor}\x1b[0m]`;

// Format handler passed to winston
const formatLogs = (log: winston.Logform.TransformableInfo): string => {
    if (log.module) return `${log.label} ${manualColorize(log.module)} [${log.level}]: ${log.message}`;

    return `${log.label} [${log.level}]: ${log.message}`;
};

export const mainLogger = winston.createLogger({
    level: config.debug.level,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.label({ label: '[Phone]' }),
                winston.format.colorize({ all: true }),
                winston.format.printf(formatLogs)
            ),
        }),
    ],
});
