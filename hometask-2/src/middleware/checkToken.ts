import { NextFunction, Request, Response } from 'express';
import { LOGIN_ERRORS } from '../types';
import { logger } from '../services/logger';
import { verifyToken } from '../services/authorization';

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        logger.error({ label: 'authorization', message: LOGIN_ERRORS.NO_AUTHORIZATION_TOKEN });

        return res.status(401).send({ success: false, message: LOGIN_ERRORS.NO_AUTHORIZATION_TOKEN });
    }

    const jwtToken = token.slice(7);

    try {
        verifyToken(jwtToken);
    } catch (err) {
        if (err) {
            logger.error({ label: 'authorization', message: LOGIN_ERRORS.INVALID_TOKEN });

            return res.status(403).json({ success: false, message: LOGIN_ERRORS.INVALID_TOKEN });
        }
    }
    return next();
};
