import { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import { LOGIN_ERRORS } from '../types';
import { log } from 'console';

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ success: false, message: LOGIN_ERRORS.NO_AUTHORIZATION_TOKEN });
    }

    const jwtToken = token.slice(7);

    jwt.verify(jwtToken, config.JWT_SECRET, (err) => {
        if (err) {
            return res.status(403).json({ success: false, message: LOGIN_ERRORS.INVALID_TOKEN });
        }

        return next();
    });
};
