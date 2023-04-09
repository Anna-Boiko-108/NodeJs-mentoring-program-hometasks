import express, { NextFunction, Request, Response } from 'express';

import { getUserById, addUser, updateUser, deleteUser, getAllUsers, getUsersByLoginSubstring } from '../data-access/user-repository';
import { validateSchema } from '../middleware/validations';
import { newUserSchema, updateUserSchema } from '../schemas';
import { getUserWithoutPassword } from '../utils/utils';
import { checkToken } from '../middleware/checkToken';
import { User } from '../types';

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.route('/:id')
    .get(checkToken, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await getUserById(req.params.id);

            res.status(200).json({ success: true, data: getUserWithoutPassword(user) });
        }  catch (err: any) {
            next(err);
        }
    })
    .put(validateSchema(updateUserSchema), checkToken, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await updateUser(req.params.id, req.body);

            res.status(200).json({ success: true, data: getUserWithoutPassword(user) });
        }  catch (err: any) {
            next(err);
        }
    })
    .delete(checkToken, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deletedUserId = await deleteUser(req.params.id);

            res.status(200).json({ success: true, data: { id: deletedUserId } });
        } catch (err: any) {
            next(err);
        }
    });

router.route('/')
    .get(checkToken, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginSubstring = req.query.loginSubstring as string;
            const limit = req.query.limit ? parseInt(req.query?.limit as string, 10) : DEFAULT_LIMIT;

            let users: User[];

            if (typeof loginSubstring === 'string') {
                users = await getUsersByLoginSubstring(loginSubstring, limit);
            } else {
                users = await getAllUsers(limit);
            }

            res.status(200).json({ success: true, data: users.map(getUserWithoutPassword) });
        } catch (err: any) {
            next(err);
        }
    })
    .post(validateSchema(newUserSchema), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = await addUser(req.body);

            res.status(201).json({ success: true, data:{ id: userId } });
        } catch (err: any) {
            next(err);
        }
    });


export default router;
