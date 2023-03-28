import { UserRecord } from '../types/user';
import { User } from '../../types/user';

export function normalizeUser(user: UserRecord): User {
    const { id, login, password, age, is_deleted } = user;

    return { id, login, password, age, isDeleted: is_deleted };
}

export function normalizeUserRecord(user: User): UserRecord {
    const { id, login, password, age, isDeleted } = user;

    return { id, login, password, age, is_deleted: isDeleted };
}
