import express, { Request, Response } from 'express';

import { getUserById, addUser, updateUser, deleteUser, getAllUsers, getUsersByLoginSubstring } from '../data-access/user-repository';
import { validateSchema } from '../middleware/validations';
import { newUserSchema, updateUserSchema } from '../schemas';
import { logger } from '../services/logger';
import { USER_ERRORS as ERRORS, User } from '../types';
import { prepareRoutesErrorLog } from '../utils/utils';

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.route('/:id')
    .get(async (req: Request, res: Response) => {
        try {
            const user = await getUserById(req.params.id);

            res.json(user);
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    })
    .put(validateSchema(updateUserSchema), async (req: Request, res: Response) => {
        try {
            const updatedUser = await updateUser(req.params.id, req.body);

            if (!updatedUser) {
                throw new Error(ERRORS.USER_NOT_FOUND);
            }

            res.json(updatedUser);
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const deletedUserId = await deleteUser(req.params.id);

            if (!deletedUserId) {
                throw new Error(ERRORS.USER_NOT_FOUND);
            }

            res.json({ id: deletedUserId });
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    });

router.route('/')
    .get(async (req: Request, res: Response) => {
        try {
            const loginSubstring = req.query.loginSubstring as string;
            const limit = req.query.limit ? parseInt(req.query?.limit as string, 10) : DEFAULT_LIMIT;

            let users: User[];

            if (typeof loginSubstring === 'string') {
                users = await getUsersByLoginSubstring(loginSubstring, limit);
            } else {
                users = await getAllUsers(limit);
            }

            res.json(users);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
            logger.error(prepareRoutesErrorLog(req, res, err));
        }
    })
    .post(validateSchema(newUserSchema), async (req: Request, res: Response) => {
        try {
            const userId = await addUser(req.body);

            res.json({ id: userId });
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    });


export default router;
