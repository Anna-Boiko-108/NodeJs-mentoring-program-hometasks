import { v4 as uuidv4 } from 'uuid';

import { mockedUsersList } from "./db.mock";

import { User } from "../types";
import { sortByLoginCallback } from '../utils/utils';

export enum ERRORS {
    USER_NOT_FOUND = 'User not found!'
}

export class DB {
    private users: User[] = mockedUsersList;

    getAllUsers = (limit?: number) => {
        const users = this.users.filter((user) => !user.isDelated).sort(sortByLoginCallback);

        return typeof limit === 'number' && limit >= 0 ? users.slice(0, limit) : users;
    }

    getUsersByLoginSubstring = (loginSubstring: string, limit?: number) => {
        const usersFound = this.users.filter((user) => {
            return user.login?.toLocaleLowerCase().includes(loginSubstring?.toLocaleLowerCase()) && !user.isDelated;
        }).sort(sortByLoginCallback);

        return typeof limit === 'number' && limit >= 0 ? usersFound.slice(0, limit) : usersFound;
    }

    getUserById = (id: string) => {
        const user = this.users.find((user) => user.id === id);

        if (!user || user?.isDelated) {
            throw new Error(ERRORS.USER_NOT_FOUND);
        }

        return user;
    }

    updateUser = (id: string, user: Partial<User>) => {
        const userIndex = this.users.findIndex((user) => user.id === id);

        if (userIndex < 0) {
            throw new Error(ERRORS.USER_NOT_FOUND);
        };

        const userBeforeUpdate = this.users[userIndex];

        if (userBeforeUpdate.isDelated) {
            throw new Error(ERRORS.USER_NOT_FOUND);
        };

        const updatedUser = { ...userBeforeUpdate, ...user };
        this.users[userIndex] = updatedUser;

        return updatedUser;
    }

    addUser = (user: User) => {
        const generatedId = uuidv4();
        const newUser = { ...user, id: generatedId, isDelated: false }
        this.users.push(newUser);

        return newUser.id;
    }

    deleteUser = (id: string) => {
        return this.updateUser(id, { isDelated: true });
    }
};

export const db = new DB();
