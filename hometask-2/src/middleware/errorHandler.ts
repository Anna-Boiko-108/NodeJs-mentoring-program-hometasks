import { NextFunction, Request, Response } from 'express';
import { logger } from '../services/logger';
import { ERRORS } from '../types';
import 'express-async-errors';
import { formatError } from '../utils/utils';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const log = formatError(err);

    logger.error({ label: 'errorHandler', message: log });

    res.status(ERRORS.INTERNAL_SERVER_ERROR.code).json({ error: ERRORS.INTERNAL_SERVER_ERROR.message });
};
