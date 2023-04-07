import { NextFunction, Request, Response } from 'express';
import { logger } from '../services/logger';


export const serviceMethodLogger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url, params } = req;

    logger.info({ label: `${method} ${url} | request`, message: `params: ${JSON.stringify(params)}` });

    next();
};
