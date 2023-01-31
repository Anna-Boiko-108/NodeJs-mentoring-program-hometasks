import { v4 as uuidv4 } from 'uuid';

import { getGroupModel, getUserGroupModel } from './models';
import getDbConnection from './models/db-connection';
import { Group } from './types';

export async function getGroupById(id: string): Promise<Group | null> {
    const group = await getGroupModel().findOne({
        where: { id },
        raw: true
    });

    return group;
}

export async function getAllGroups(limit?: number): Promise<Group[] | null> {
    const groups = await getGroupModel().findAll({
        limit: limit || undefined,
        order: [['name', 'ASC']],
        raw: true
    });

    return groups;
}

export async function createGroup(group: Omit<Group, 'id'>): Promise<string> {
    const generatedId = uuidv4();
    const newGroup = { ...group, id: generatedId };

    const response = (await getGroupModel().create(newGroup)).get({ plain: true });

    return response?.id;
}

export async function updateGroup(id: string, group: Partial<Group>): Promise<Group | null> {
    const response = await getGroupModel().update(group, {
        fields: [
            'name', 'permission'
        ],
        where: {
            id
        },
        returning: true
    });

    const updatedGroup = response[1][0];

    return updatedGroup;
}

export async function deleteGroup(id: string): Promise<number> {
    const response = await getGroupModel().destroy({
        where: {
            id
        }
    });

    return response;
}

export async function addUsersToGroup(groupId: string, userIds: Array<string>) {
    try {
        await getDbConnection().transaction(async (t) => {
            const sequelize = await getUserGroupModel();

            const rowsToCreate = userIds.map(async (userId) => {
                await sequelize.create({
                    groupId,
                    userId
                }, { transaction: t });
            });
            await Promise.all(rowsToCreate);
        });

        // If the execution reaches this line, the transaction has been committed successfully
        // `result` is whatever was returned from the transaction callback
    } catch (error) {
        // If the execution reaches this line, an error occurred.
        // The transaction has already been rolled back automatically by Sequelize!

        console.log(error);
        throw (error);
    }
}
