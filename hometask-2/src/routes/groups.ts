import express, { Request, Response } from 'express';

import { addUsersToGroup, createGroup, deleteGroup, getAllGroups, getGroupById, updateGroup } from '../data-access/group-repository';
import { validateSchema } from '../middleware/validations';
import { newGroupSchema, updateGroupSchema } from '../schemas/groups';
import { logger } from '../services/logger';
import { Group, GROUP_ERRORS as ERRORS } from '../types';
import { prepareRoutesErrorLog } from '../utils/utils';

const router = express.Router();

const DEFAULT_LIMIT = 20;

router.route('/:id')
    .get(async (req: Request, res: Response) => {
        try {
            const group = await getGroupById(req.params.id);

            if (!group) {
                throw new Error(ERRORS.GROUP_NOT_FOUND);
            }

            res.json(group);
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    })
    .put(validateSchema(updateGroupSchema), async (req: Request, res: Response) => {
        try {
            const updatedGroup = await updateGroup(req.params.id, req.body);

            if (!updatedGroup) {
                throw new Error(ERRORS.GROUP_NOT_FOUND);
            }

            res.json(updatedGroup);
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    })
    .delete(async (req: Request, res: Response) => {
        try {
            const deletedRowsCount = await deleteGroup(req.params.id);

            if (!deletedRowsCount) {
                throw new Error(ERRORS.GROUP_NOT_FOUND);
            }

            res.json({ deletedRowsCount });
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    });

router.route('/')
    .get(async (req: Request, res: Response) => {
        try {
            const limit = req.query.limit ? parseInt(req.query?.limit as string, 10) : DEFAULT_LIMIT;

            const groups = await getAllGroups(limit);

            res.json(groups);
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    })
    .post(validateSchema(newGroupSchema), async (req: Request, res: Response) => {
        try {
            const groupId = await createGroup(req.body);

            res.json({ id: groupId });
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    });

router.route('/:id/add-users')
    .post(async (req: Request, res: Response) => {
        try {
            const groupId = req.params.id;
            const group = await getGroupById(groupId);

            if (!group) {
                throw new Error(ERRORS.GROUP_NOT_FOUND);
            }

            const userIds = req.body.userIds;

            await addUsersToGroup(groupId, userIds);

            res.json({ groupId });
        } catch (err: any) {
            logger.error(prepareRoutesErrorLog(req, res, err));
            res.status(400).json({ message: err.message });
        }
    });


export default router;
