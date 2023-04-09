import express, { Request } from 'express';

import { getUserById, addUser, updateUser, deleteUser, getAllUsers, getUsersByLoginSubstring } from '../data-access/user-repository';
import { validateSchema } from '../middleware/validations';
import { newUserSchema, updateUserSchema } from '../schemas';
import { getUserWithoutPassword, handleResult } from '../utils/utils';
import { checkToken } from '../middleware/checkToken';
import { User } from '../types';

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.route('/:id')
    .get(checkToken, handleResult(async (req: Request) => {
        const user = await getUserById(req.params.id);

        return getUserWithoutPassword(user);
    }))
    .put(validateSchema(updateUserSchema), checkToken,  handleResult(async (req: Request) => {
        const user = await updateUser(req.params.id, req.body);

        return getUserWithoutPassword(user);
    }))
    .delete(checkToken,  handleResult(async (req: Request) => {
        const deletedUserId = await deleteUser(req.params.id);

        return { id: deletedUserId };
    }));

router.route('/')
    .get(checkToken,  handleResult(async (req: Request) => {
        const loginSubstring = req.query.loginSubstring as string;
        const limit = req.query.limit ? parseInt(req.query?.limit as string, 10) : DEFAULT_LIMIT;

        let users: User[];

        if (typeof loginSubstring === 'string') {
            users = await getUsersByLoginSubstring(loginSubstring, limit);
        } else {
            users = await getAllUsers(limit);
        }

        return users.map(getUserWithoutPassword);
    }))
    .post(validateSchema(newUserSchema),  handleResult(async (req: Request) => {
        const userId = await addUser(req.body);

        return { id: userId };
    }));


export default router;
