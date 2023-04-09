import express, { Request, Response } from 'express';

import { addUsersToGroup, createGroup, deleteGroup, getAllGroups, getGroupById, updateGroup } from '../data-access/group-repository';
import { validateSchema } from '../middleware/validations';
import { newGroupSchema, updateGroupSchema } from '../schemas';
import { handleResult } from '../utils/utils';
import { checkToken } from '../middleware/checkToken';

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.route('/:id')
    .get(checkToken, handleResult(async (req: Request) => {
        return await getGroupById(req.params.id);
    }))
    .put(checkToken, validateSchema(updateGroupSchema), handleResult(async (req: Request) => {
        return await updateGroup(req.params.id, req.body);
    }))
    .delete(checkToken, handleResult(async (req: Request) => {
        const deletedRowsCount = await deleteGroup(req.params.id);

        return { deletedRowsCount };
    }));

router.route('/')
    .get(checkToken, handleResult(async (req: Request) => {
        const limit = req.query.limit ? parseInt(req.query?.limit as string, 10) : DEFAULT_LIMIT;

        return await getAllGroups(limit);
    }))
    .post(checkToken, validateSchema(newGroupSchema), handleResult(async (req: Request) => {
        const groupId = await createGroup(req.body);

        return { id: groupId };
    }));

router.route('/:id/add-users')
    .post(checkToken, handleResult(async (req: Request) => {
        const groupId = req.params.id;
        await getGroupById(groupId);

        const userIds = req.body.userIds;

        await addUsersToGroup(groupId, userIds);

        return { groupId };
    }));


export default router;
