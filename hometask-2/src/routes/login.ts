import express, { Request } from 'express';

import {  getUserByLogin } from '../data-access/user-repository';
import { validateSchema } from '../middleware/validations';
import { handleResult } from '../utils/utils';
import { loginSchema } from '../schemas';
import { getToken } from '../services/authorization';
import { LOGIN_ERRORS } from '../types';
import { isHashMatch } from '../services/bcrypt';

const router = express.Router();

router.route('/')
    .post(validateSchema(loginSchema), handleResult(async (req: Request) => {
        const { login, password } = req.body;
        const user = await getUserByLogin(login);

        const { password: userPasswordHash, ...userData } = user;
        const isPasswordMatched = await isHashMatch(password, userPasswordHash);

        if (!isPasswordMatched) {
            throw new Error(LOGIN_ERRORS.PASSWORDS_DO_NOT_MATCH);
        }

        const token = getToken(userData);
        return { token };
    }));


export default router;
