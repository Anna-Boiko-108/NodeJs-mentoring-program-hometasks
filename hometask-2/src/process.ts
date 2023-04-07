import { logger } from './services/logger';

export const setupErrorHandlers = () => {
    process.on('uncaughtException', (error: Error) =>
        logger.error({ label: 'uncaughtException', message: error.message })
    );
    process.on('unhandledRejection', (reason: unknown) =>
        logger.error({ label: 'unhandledRejection', message: `Reason:  ${reason}` })
    );
};
