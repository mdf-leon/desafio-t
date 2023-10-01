import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { formatError } from 'src/utils/error.utils';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async addUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.usersService.createUser(username, password);
      return { success: 'User created successfully', user };
    } catch (error) {
      if (!username || !password) {
        throw new BadRequestException(
          formatError(
            this.configService,
            'Username and password are required',
            null,
          ),
        );
      }
      throw new BadRequestException(
        formatError(this.configService, 'Failed to create user', error),
      );
    }
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return {
      success: users.length === 0 ? 'No users were found' : 'Users were found',
      users,
    };
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    // return this.usersService.getUser(username);
    const user = await this.usersService.getUser(username);

    if (!user) return formatError(this.configService, 'User not found', null);
    return { success: 'User found', user };
  }

  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @Body('username') newUsername: string,
    @Body('password') newPassword: string,
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(
        username,
        newUsername,
        newPassword,
      );
      return { success: 'User updated', user: updatedUser };
    } catch (error) {
      throw new BadRequestException(
        formatError(this.configService, 'Failed to update user', error),
      );
    }
  }

  @Delete(':username')
  async removeUser(@Param('username') username: string) {
    await this.usersService.deleteUser(username);
    return { success: `User ${username} deleted` };
  }
}
