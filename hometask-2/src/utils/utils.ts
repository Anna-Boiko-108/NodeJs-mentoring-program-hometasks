import { Request, Response } from 'express';
import { USER_ERRORS, GROUP_ERRORS, User } from '../types';
import { logger } from '../services/logger';

export const sortByLoginCallback = (a: User, b: User) => {
    const nameA = a.login.toUpperCase();
    const nameB = b.login.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    return 0;
};

export const formatError = (err: Error, text?: string) => {
    const additionalText = text ? `${text  }: ` : '';
    return `${additionalText}${err.message} ${err}`;
};

export const prepareRoutesErrorLog = (req: Request, res: Response, error: Error) => {
    const { method, baseUrl } = req;

    return { label: `${method} ${baseUrl} | error`, message: error?.message };
};

export const prepareMethodsInfoLog = (methodName: string, params: Record<string, unknown>) => {
    const message = Object.keys(params).map(param => `${param}: ${typeof params[param] === 'object' ? JSON.stringify(params[param]) : params[param]}`).join(', ');
    return { label: methodName, message };
};

export const getUserWithoutPassword = (user: User): Omit<User, 'password'> => {
    const { password, ...userData } = user;
    return userData;
};

export const handleResult = <T>(callback: (req: Request, res: Response) => Promise<T>) => async (req: Request, res: Response) => {
    try {
        const result = await callback(req, res);
        res.status(200).json({ success: true, data: result });
    } catch (err: any) {
        logger.error(prepareRoutesErrorLog(req, res, err));

        const ERRORS = { ...GROUP_ERRORS, ...USER_ERRORS };

        if (Object.values(ERRORS).some(message => message === err.message)) {
            res.status(400).json({ success: false, message: err.message });
        } else {
            throw new Error(err);
        }
    }
};
