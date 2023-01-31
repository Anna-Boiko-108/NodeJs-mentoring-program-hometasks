import { UserRecord } from '../types/user';
import { User } from '../../types/user';

export function normalizeUser(user: UserRecord | null): User | null {
    if (!user) {
        return user;
    }
    const { id, login, password, age, is_deleted } = user;

    return { id, login, password, age, isDeleted: is_deleted };
}

export function normalizeUserRecord(user: User | null): UserRecord | undefined {
    if (!user) {
        return;
    }
    const { id, login, password, age, isDeleted } = user;

    return { id, login, password, age, is_deleted: isDeleted };
}
