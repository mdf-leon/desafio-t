import { User } from 'src/users/user.model';

export {};

declare module 'express' {
  export interface Request {
    user: User;
  }
}
