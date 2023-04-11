import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../services/logger';

import { USER_ERRORS, User } from '../types';
import { prepareMethodsInfoLog } from '../utils/utils';
import { getUserModel } from './models/user';
import { normalizeUser, normalizeUserRecord } from './normalizers/user';
import { getHashAsync } from '../services/bcrypt';

export async function getUserById(id: string): Promise<User> {
    logger.info(prepareMethodsInfoLog('getUserById', { id }));

    const user = await getUserModel().findOne({
        where: { id, is_deleted: false },
        raw: true
    });

    if (!user) throw new Error(USER_ERRORS.USER_NOT_FOUND);

    return normalizeUser(user);
}

export async function getUserByLogin(login: string): Promise<User> {
    logger.info(prepareMethodsInfoLog('getUserByLogin', { login }));

    const user = await getUserModel().findOne({
        where: { login, is_deleted: false },
        raw: true
    });

    if (!user)  throw new Error(USER_ERRORS.USER_NOT_FOUND);

    return normalizeUser(user);
}

export async function addUser(user: Omit<User, 'id | isDeleted'>): Promise<string> {
    const { login, password, age } = user;
    logger.info(prepareMethodsInfoLog('addUser', { login, age }));

    const generatedId = uuidv4();
    const passwordHash = await getHashAsync(password);
    const newUser = { ...user, id: generatedId, password: passwordHash, isDeleted: false };
    logger.info(prepareMethodsInfoLog('addUser', { generatedId }));

    const response = (await getUserModel().create(normalizeUserRecord(newUser))).get({ plain: true });

    return response.id;
}

export async function updateUser(id: string, user: Pick<User, 'login' | 'password' | 'age'>): Promise<User> {
    logger.info(prepareMethodsInfoLog('updateUser', { id, user }));

    let newUser = user;
    if (user.password) {
        const passwordHash = await getHashAsync(user.password);
        newUser = { ...user, password: passwordHash };
    }

    const response = await getUserModel().update(newUser, {
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

    if (!updatedUser) throw new Error(USER_ERRORS.USER_NOT_FOUND);

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

    if (!softDeletedUser) throw new Error(USER_ERRORS.USER_NOT_FOUND);

    return softDeletedUser.id;
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
