export enum EPermissions {
  CHANGE_PERMISSIONS = "changePermissions",
  CREATE_USER = "createUser",
  READ_USER = "readUser",
  UPDATE_USER = "updateUser",
  DELETE_USER = "deleteUser",
}

export interface IUser {
  id: number;
  username: string;
  password: string;
  permissions: EPermissions[];
}

export interface ICreateUser {
  username: string;
  password: string;
}
