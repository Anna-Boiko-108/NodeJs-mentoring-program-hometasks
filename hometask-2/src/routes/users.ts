import express, { Request, Response } from 'express';

import { db } from '../db';
import { validateSchema } from '../middleware/validations';
import { newUserSchema, updateUserSchema } from '../schemas/users';
import { User } from '../types';

const router = express.Router();

router.route('/:id')
    .get((req: Request, res: Response) => {
        try {
            const user = db.getUserById(req.params.id);

            res.json(user);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    })
    .put(validateSchema(updateUserSchema), (req: Request, res: Response) => {
        try {
            const updatedUser = db.updateUser(req.params.id, req.body);

            res.json(updatedUser);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    })
    .delete((req: Request, res: Response) => {
        try {
            const deletedUserId = db.deleteUser(req.params.id);

            res.json({ id: deletedUserId.id });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    })

router.route('/')
    .get((req: Request, res: Response) => {
        try {
            const loginSubstring = req.query.loginSubstring as string;
            const limit = parseInt(req.query.limit as string, 10) as number;

            let users: User[];

            if (typeof loginSubstring === 'string') {
                users = db.getUsersByLoginSubstring(loginSubstring, limit);
            } else {
                users = db.getAllUsers(limit);
            }

            res.json(users);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    })
    .post(validateSchema(newUserSchema), (req: Request, res: Response) => {
        try {
            const userId = db.addUser(req.body);

            res.json({ id: userId });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    })



export default router;