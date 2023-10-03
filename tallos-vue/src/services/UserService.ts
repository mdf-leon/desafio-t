import api from "./api";
import { IUser, ICreateUser } from "../types/User";

const UserService = {
  getUsers(): Promise<IUser[]> {
    return api.get(`users`).then((response) => response.data);
  },

  getUser(userName: string): Promise<IUser> {
    return api.get(`users/${userName}`).then((response) => response.data);
  },

  register(userData: ICreateUser): Promise<{ user: IUser; token: string }> {
    return api.post("auth/register", userData).then((response) => {
      console.log(response.data);
      return response.data;
    });
  },
};

export default UserService;
