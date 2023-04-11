import { Request, Response } from 'express';
import { User } from '../types';

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

    return { label: `${method} ${baseUrl}`, message: error?.message };
};

export const prepareMethodsInfoLog = (methodName: string, params: Record<string, unknown>) => {
    const message = Object.keys(params).map(param => `${param}: ${typeof params[param] === 'object' ? JSON.stringify(params[param]) : params[param]}`).join(', ');
    return { label: methodName, message };
};

export const getUserWithoutPassword = (user: User): Omit<User, 'password'> => {
    const { password, ...userData } = user;
    return userData;
};
