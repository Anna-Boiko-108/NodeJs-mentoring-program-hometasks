export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type Group = {
  id: string;
  name: string;
  permission: Array<Permission>;
};


export enum GROUP_ERRORS {
    GROUP_NOT_FOUND = 'Group not found!'
}
