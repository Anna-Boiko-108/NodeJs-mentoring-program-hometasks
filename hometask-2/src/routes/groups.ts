import express, { NextFunction, Request, Response } from 'express';

import { addUsersToGroup, createGroup, deleteGroup, getAllGroups, getGroupById, updateGroup } from '../data-access/group-repository';
import { validateSchema } from '../middleware/validations';
import { newGroupSchema, updateGroupSchema } from '../schemas';
import { checkToken } from '../middleware/checkToken';

const router = express.Router();

const DEFAULT_LIMIT = 10;

router.route('/:id')
    .get(checkToken, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const group = await getGroupById(req.params.id);

            res.status(200).json({ success: true, data: group });
        }  catch (err: any) {
            next(err);
        }
    })
    .put(checkToken, validateSchema(updateGroupSchema),  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const group = await updateGroup(req.params.id, req.body);

            res.status(200).json({ success: true, data: group });
        }  catch (err: any) {
            next(err);
        }
    })
    .delete(checkToken, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deletedRowsCount = await deleteGroup(req.params.id);

            res.status(200).json({ success: true, data:  { deletedRowsCount } });
        }  catch (err: any) {
            next(err);
        }
    });

router.route('/')
    .get(checkToken,  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query?.limit as string, 10) : DEFAULT_LIMIT;

            const groups = await getAllGroups(limit);

            res.status(200).json({ success: true, data: groups });
        }  catch (err: any) {
            next(err);
        }
    })
    .post(checkToken, validateSchema(newGroupSchema),  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const groupId = await createGroup(req.body);

            res.status(201).json({ success: true, data: { id: groupId } });
        }  catch (err: any) {
            next(err);
        }
    });

router.route('/:id/add-users')
    .post(checkToken,  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const groupId = req.params.id;
            await getGroupById(groupId);

            const userIds = req.body.userIds;

            await addUsersToGroup(groupId, userIds);

            res.status(201).json({ success: true, data: { id: groupId } });
        }  catch (err: any) {
            next(err);
        }
    });


export default router;
