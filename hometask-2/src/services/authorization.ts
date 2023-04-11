import jwt from 'jsonwebtoken';

import { config } from '../config';

const KEY = config.JWT_SECRET || 'noyfb';

export const getToken = (user: Record<string, any>) => {
    return jwt.sign(user, KEY, { expiresIn: 120 });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, KEY);
};
