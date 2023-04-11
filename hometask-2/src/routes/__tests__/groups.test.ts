import request from 'supertest';
import { expect, jest } from '@jest/globals';
import express, { NextFunction, Request, Response } from 'express';
import router from '../groups';
import {  addUsersToGroup, createGroup, deleteGroup, getAllGroups, getGroupById, updateGroup  } from '../../data-access/group-repository';
import { groups as groupsMock } from '../../mocks';


jest.mock('../../data-access/group-repository');

jest.mock('../../middleware/checkToken', () => ({
    checkToken: jest.fn((req, res, next: NextFunction) => next())
}));
jest.mock('../../middleware/validations', () => ({
    validateSchema: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));

describe('Groups router', () => {
    const app = express().use(express.json()).use(router);

    const id = '1';
    const groupMock = { id, ...groupsMock[0] };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /:id', () => {
        it('should return a group by id', async () => {
            (getGroupById as jest.Mock).mockImplementationOnce((id) => {
                return Promise.resolve(groupMock);
            });

            const response = await request(app).get(`/${id}`);

            expect(getGroupById).toBeCalledTimes(1);
            expect(getGroupById).toBeCalledWith(id);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: groupMock });
        });
    });

    describe('PUT /:id', () => {
        it('should update group by id', async () => {
            const updatedFields = { name: 'admin2' };
            const updateGroupMock = { ...groupMock,  ...updatedFields };
            (updateGroup as jest.Mock).mockImplementationOnce((id) => {
                return Promise.resolve(updateGroupMock);
            });

            const response = await request(app).put(`/${id}`).send(updatedFields);

            expect(updateGroup).toBeCalledTimes(1);
            expect(updateGroup).toBeCalledWith(id, updatedFields);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: updateGroupMock });
        });
    });

    describe('DELETE /:id', () => {
        it('should delete group by id', async () => {
            (deleteGroup as jest.Mock).mockImplementationOnce((id) => {
                return Promise.resolve(id);
            });

            const response = await request(app).delete(`/${id}`);

            expect(deleteGroup).toBeCalledTimes(1);
            expect(deleteGroup).toBeCalledWith(id);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, data: { deletedRowsCount: '1' } });
        });
    });

    describe('GET /', () => {
        const defaultLimit = 10;
        const limit = 5;

        const successResponseBodyMock = {
            success: true,
            data: groupsMock
        };
        it('should get all groups', async () => {
            (getAllGroups as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(groupsMock);
            });

            const response = await request(app).get('/');

            expect(getAllGroups).toBeCalledTimes(1);
            expect(getAllGroups).toBeCalledWith(defaultLimit);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(successResponseBodyMock);
        });
        it('should get all groups with limit', async () => {
            (getAllGroups as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(groupsMock);
            });

            const response = await request(app).get('/').query({ limit });

            expect(getAllGroups).toBeCalledTimes(1);
            expect(getAllGroups).toBeCalledWith(limit);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(successResponseBodyMock);
        });
    });

    describe('POST /', () => {
        it('should create group', async () => {
            const requestBody = { ...groupsMock[0] };
            (createGroup as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(id);
            });

            const response = await request(app).post('/').set('Accept', 'application/json').send(requestBody);

            expect(createGroup).toBeCalledTimes(1);
            expect(createGroup).toBeCalledWith(requestBody);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ success: true, data: { id } });
        });
    });

    describe('POST /:id/add-users', () => {
        it('should add users to group by id', async () => {
            const requestBody = { userIds: ['1', '2'] };
            (getGroupById as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve(groupsMock[0]);
            });
            (addUsersToGroup as jest.Mock).mockImplementationOnce(() => {
                return Promise.resolve();
            });

            const response = await request(app).post(`/${id}/add-users`).set('Accept', 'application/json').send(requestBody);

            expect(getGroupById).toBeCalledTimes(1);
            expect(getGroupById).toBeCalledWith(id);
            expect(addUsersToGroup).toBeCalledTimes(1);
            expect(addUsersToGroup).toBeCalledWith(id, requestBody.userIds);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ success: true, data: { id } });
        });
    });
});
