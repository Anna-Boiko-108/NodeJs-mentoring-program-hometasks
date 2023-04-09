import express, { Request, Response } from 'express';

import {  getUserByLogin } from '../data-access/user-repository';
import { validateSchema } from '../middleware/validations';
import { logger } from '../services/logger';
import { prepareRoutesErrorLog } from '../utils/utils';
import { loginSchema } from '../schemas';
import { getToken } from '../services/authorization';
import { LOGIN_ERRORS } from '../types';

const router = express.Router();

router.route('/')
    .post(validateSchema(loginSchema), async (req: Request, res: Response) => {
        try {
            const { login, password } = req.body;
            const user = await getUserByLogin(login);

            const { password: userPassword, ...userData } = user;

            if (userPassword !== password) {
                throw new Error(LOGIN_ERRORS.PASSWORDS_DO_NOT_MATCH);
            }

            const token = getToken(userData);
            res.json({ token });
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    });


export default router;
