import request from 'supertest';
import { expect, jest } from '@jest/globals';
import express, { NextFunction, Request, Response } from 'express';
import router from '../users';
import { getUserById, addUser, updateUser, deleteUser, getAllUsers, getUsersByLoginSubstring } from '../../data-access/user-repository';
import { users as usersMock } from '../../mocks';


jest.mock('../../data-access/user-repository');

jest.mock('../../middleware/checkToken', () => ({
    checkToken: jest.fn((req, res, next: NextFunction) => next())
}));
jest.mock('../../middleware/validations', () => ({
    validateSchema: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));

describe('Users router', () => {
    const app = express().use(express.json()).use(router);

    const id = '1';
    const userMock = { id, ...usersMock[0] };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /:id', () => {
        it('should return a user by id', async () => {
            (getUserById as jest.Mock).mockImplementationOnce((id) => {
                return Promise.resolve(userMock);
            });

            const response = await request(app).get(`/${id}`);

            expect(getUserById).toBeCalledTimes(1);
            expect(getUserById).toBeCalledWith(id);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: { ...userMock, password: undefined } });
        });
    });

    describe('PUT /:id', () => {
        it('should update a user by id', async () => {
            const updatedFields = { login: 'Jane' };
            const updateUserMock = { ...userMock,  ...updatedFields };
            (updateUser as jest.Mock).mockImplementationOnce((id) => {
                return Promise.resolve(updateUserMock);
            });

            const response = await request(app).put(`/${id}`).send(updatedFields);

            expect(updateUser).toBeCalledTimes(1);
            expect(updateUser).toBeCalledWith(id, updatedFields);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: { ...updateUserMock, password: undefined } });
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a user by id', async () => {
            (deleteUser as jest.Mock).mockImplementationOnce((id) => {
                return Promise.resolve(id);
            });

            const response = await request(app).delete(`/${id}`);

            expect(deleteUser).toBeCalledTimes(1);
            expect(deleteUser).toBeCalledWith(id);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: { id } });
        });
    });

    describe('GET /', () => {
        const loginSubstring = 'An';
        const defaultLimit = 10;
        const limit = 5;

        const successResponseBodyMock = {
            success: true,
            data: usersMock.map(user => ({ ...user, password: undefined }))
        };
        it('should get all users', async () => {
            (getAllUsers as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(usersMock);
            });

            const response = await request(app).get('/');

            expect(getAllUsers).toBeCalledTimes(1);
            expect(getAllUsers).toBeCalledWith(defaultLimit);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(successResponseBodyMock);
        });
        it('should get all users with substring', async () => {
            (getUsersByLoginSubstring as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(usersMock);
            });

            const response = await request(app).get('/').query({ loginSubstring });

            expect(getUsersByLoginSubstring).toBeCalledTimes(1);
            expect(getUsersByLoginSubstring).toBeCalledWith(loginSubstring, defaultLimit);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(successResponseBodyMock);
        });
        it('should get all users with limit', async () => {
            (getAllUsers as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(usersMock);
            });

            const response = await request(app).get('/').query({ limit });

            expect(getAllUsers).toBeCalledTimes(1);
            expect(getAllUsers).toBeCalledWith(limit);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(successResponseBodyMock);
        });
    });

    describe('POST /', () => {
        it('should create user', async () => {
            const requestBody = { ...usersMock[0], isDeleted: undefined };
            (addUser as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(id);
            });

            const response = await request(app).post('/').set('Accept', 'application/json').send(requestBody);

            expect(addUser).toBeCalledTimes(1);
            expect(addUser).toBeCalledWith(requestBody);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ success: true, data: { id } });
        });
    });
});
