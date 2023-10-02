import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = [];
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(username: string, password: string, showPassword = false) {
    const newUser = new this.userModel({
      username,
      password: await bcrypt.hash(password, 10),
    });
    const user = await newUser.save();
    return {
      id: user.id,
      username: user.username,
      password: showPassword ? user.password : null,
    };
  }

  async getAllUsers(showPassword = false) {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      password: showPassword ? user.password : null,
    }));
  }

  async getUser(username: string, showPassword = false) {
    const user = await this.findUser(username);

    return (
      user && {
        id: user.id,
        username: user.username,
        password: showPassword ? user.password : null,
      }
    );
  }

  async updateUser(
    username: string,
    newUsername: string,
    newPassword: string,
    showPassword = false,
  ) {
    const user = await this.findUser(username);
    if (newPassword) {
      user.username = newUsername;
      user.password = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await user.save();
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      password: showPassword ? updatedUser.password : null,
    };
  }

  async deleteUser(username: string) {
    const result = await this.userModel.deleteOne({ username }).exec();
    return result.deletedCount;
  }

  private async findUser(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    return user;
  }
}
