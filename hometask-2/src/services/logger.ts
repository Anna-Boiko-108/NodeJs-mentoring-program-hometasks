import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, prettyPrint } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ],
    format: combine(
        timestamp(),
        myFormat
    )
});

export const isDebug = process.env.LOG_LEVEL === 'DEBUG';
export const isLocal = process.env.NODE_ENV === 'dev';

export const getLogLevel = () => {
    return process.env.LOG_LEVEL;
};
