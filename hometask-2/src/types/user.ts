export type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

export enum USER_ERRORS {
    USER_NOT_FOUND = 'User not found!'
}
