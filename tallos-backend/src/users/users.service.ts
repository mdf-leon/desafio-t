import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser<TShowPassword extends boolean>(
    username: string,
    password: string,
    showPassword?: TShowPassword,
  ): Promise<TShowPassword extends true ? User : Omit<User, 'password'>> {
    const newUser = new this.userModel({
      username,
      password: await bcrypt.hash(password, 10),
    });
    const user = await newUser.save();

    if (showPassword !== true) user.password = undefined;

    return user;
  }

  async getAllUsers<TShowPassword extends boolean>(
    showPassword?: TShowPassword,
  ): Promise<TShowPassword extends true ? User[] : Omit<User, 'password'>[]> {
    const users = await this.userModel.find().exec();
    if (showPassword !== true) {
      users.forEach((user) => {
        user.password = undefined;
      });
    }
    return users;
  }

  async getUser<TShowPassword extends boolean>(
    username: string,
    showPassword?: TShowPassword,
  ) {
    return await this.findUser(username, showPassword);
  }

  async updateUser<TShowPassword extends boolean>(
    username: string,
    newUsername: string,
    newPassword: string,
    showPassword?: TShowPassword,
  ) {
    const user = await this.findUser(username, true);
    if (newPassword) {
      user.username = newUsername;
      user.password = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await user.save();
    if (showPassword !== true) updatedUser.password = undefined;

    return updatedUser;
  }

  async deleteUser(username: string) {
    const result = await this.userModel.deleteOne({ username }).exec();
    return result.deletedCount;
  }

  private async findUser<TShowPassword extends boolean>(
    username: string,
    showPassword?: TShowPassword,
  ): Promise<TShowPassword extends true ? User : Omit<User, 'password'>> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return null;
    }
    if (showPassword !== true) user.password = undefined;
    return user;
  }

  async updateUserPermissions<TShowPassword extends boolean>(
    username: string,
    permissions: string[],
    showPassword?: TShowPassword,
  ): Promise<TShowPassword extends true ? User : Omit<User, 'password'>> {
    const user = await this.findUser(username, true);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.permissions = permissions;
    await user.save();
    if (showPassword !== true) user.password = undefined;
    return user;
  }
}
