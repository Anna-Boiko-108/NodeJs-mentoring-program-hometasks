import { User } from "../types";

export const sortByLoginCallback = (a: User, b: User) => {
    const nameA = a.login.toUpperCase();
    const nameB = b.login.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    return 0;
};
