import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../services/logger';

import { User } from '../types';
import { prepareMethodsInfoLog } from '../utils/utils';
import { getUserModel } from './models/user';
import { normalizeUser, normalizeUserRecord } from './normalizers/user';

export async function getUserById(id: string): Promise<User | null> {
    logger.info(prepareMethodsInfoLog('getUserById', { id }));

    const user = await getUserModel().findOne({
        where: { id, is_deleted: false },
        raw: true
    });

    if (!user) return null;

    return normalizeUser(user);
}

export async function addUser(user: Omit<User, 'id | isDeleted'>): Promise<string> {
    const { login, age } = user;
    logger.info(prepareMethodsInfoLog('addUser', { login, age }));

    const generatedId = uuidv4();
    const newUser = { ...user, id: generatedId, isDeleted: false };
    logger.info(prepareMethodsInfoLog('addUser', { generatedId }));

    const response = (await getUserModel().create(normalizeUserRecord(newUser))).get({ plain: true });

    return response?.id;
}

export async function updateUser(id: string, user: Partial<User>): Promise<User | null> {
    logger.info(prepareMethodsInfoLog('updateUser', { id, user }));

    const response = await getUserModel().update(user, {
        fields: [
            'login', 'password', 'age'
        ],
        where: {
            id,
            is_deleted: false
        },
        returning: true
    });

    const updatedUser = response[1][0];

    if (!updatedUser) return null;

    return normalizeUser(updatedUser);
}

export async function deleteUser(id: string): Promise<string> {
    logger.info(prepareMethodsInfoLog('deleteUser', { id }));

    const response = await getUserModel().update({ is_deleted: true }, {
        fields: [
            'is_deleted'
        ],
        where: {
            id,
            is_deleted: false
        },
        returning: true
    });

    const softDeletedUser = response?.[1]?.[0];

    return softDeletedUser?.id;
}

export async function getAllUsers(limit: number) {
    logger.info(prepareMethodsInfoLog('getAllUsers', { limit }));

    const users = await getUserModel().findAll({
        where: { is_deleted: false },
        limit,
        order: [['login', 'ASC']],
        raw: true
    });

    return users.map(normalizeUser);
}


export async function getUsersByLoginSubstring(loginSubstring: string, limit: number) {
    logger.info(prepareMethodsInfoLog('getUsersByLoginSubstring', { loginSubstring, limit }));

    const users = await getUserModel().findAll({
        where: { is_deleted: false, login: { [Op.iLike]: `%${loginSubstring}%` } },
        limit,
        order: [['login', 'ASC']],
        raw: true
    });

    return users.map(normalizeUser);
}
