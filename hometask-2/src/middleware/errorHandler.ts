import { NextFunction, Request, Response } from 'express';
import { logger } from '../services/logger';
import { ERRORS as COMMON_ERRORS, GROUP_ERRORS, USER_ERRORS } from '../types';
import 'express-async-errors';
import { formatError, prepareRoutesErrorLog } from '../utils/utils';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const ERRORS = { ...GROUP_ERRORS, ...USER_ERRORS };

    if (Object.values(ERRORS).some(message => message === err.message)) {
        logger.error(prepareRoutesErrorLog(req, res, err));

        res.status(400).json({ success: false, message: err.message });
    } else {
        logger.error({ label: 'errorHandler', message: formatError(err) });

        res.status(COMMON_ERRORS.INTERNAL_SERVER_ERROR.code).json({  success: false, message: COMMON_ERRORS.INTERNAL_SERVER_ERROR.message });
    }
};
