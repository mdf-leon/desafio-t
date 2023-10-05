import { IUser, IAuthUser, EPermissions } from "../types/User";
import { http } from "./HTTP";

const UserService = {
  createUser(userData: IAuthUser): Promise<{ success: string; user: IUser }> {
    return http.post("users", userData).then((response) => {
      console.log(response.data);
      return response.data;
    });
  },

  getUsers(): Promise<{ success: string; users: IUser[] }> {
    return http.get(`users`).then((response) => response.data);
  },

  getUser(userName: string): Promise<{ success: string; user: IUser }> {
    return http.get(`users/${userName}`).then((response) => response.data);
  },

  updateUser(
    userName: string,
    userData: IAuthUser
  ): Promise<{ success: string; user: IUser }> {
    return http.patch(`users/${userName}`, userData).then((response) => {
      console.log(response.data, userData);
      return response.data;
    });
  },

  deleteUser(userName: string): Promise<{ success: string }> {
    return http.delete(`users/${userName}`).then((response) => {
      console.log(response.data);
      return response.data;
    });
  },

  updateUserPermissions(
    userName: string,
    permissions: EPermissions[]
  ): Promise<{ success: string; user: IUser }> {
    return http
      .patch(`users/${userName}/permissions`, { permissions })
      .then((response) => {
        console.log(response.data);
        return response.data;
      });
  },

  register(
    userData: IAuthUser
  ): Promise<{ success: string; user: IUser; token: string }> {
    return http.post("auth/register", userData).then((response) => {
      console.log(response.data);
      return response.data;
    });
  },

  login(userData: IAuthUser): Promise<{ success: string; token: string }> {
    return http.post("auth/login", userData).then((response) => {
      console.log(response.data);
      return response.data;
    });
  },
};

export default UserService;
