import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { formatError } from '../utils/error.utils';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.model';
import {
  UserUsernameDto,
  UpdateUserReqDto,
  UserPermissionReqDto,
  CreateUserReqDto,
} from './dto/user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private hasPermission(user: User, requiredPermission: string): boolean {
    return user.permissions.includes(requiredPermission);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async addUser(
    @Body() { username, password }: CreateUserReqDto,
    @Req() req: Request,
  ) {
    if (!this.hasPermission(req.user, 'createUser')) {
      throw new ForbiddenException('Permission denied');
    }

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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully retrieved.',
  })
  async getAllUsers(@Req() req: Request) {
    if (!this.hasPermission(req.user, 'readUser')) {
      throw new ForbiddenException('Permission denied');
    }

    const users = await this.usersService.getAllUsers();
    return {
      success: users.length === 0 ? 'No users were found' : 'Users were found',
      users,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get(':username')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
  })
  async getUser(@Param() { username }: UserUsernameDto, @Req() req: Request) {
    if (!this.hasPermission(req.user, 'readUser')) {
      throw new ForbiddenException('Permission denied');
    }

    const user = await this.usersService.getUser(username);

    if (!user) return formatError(this.configService, 'User not found', null);
    return { success: 'User found', user };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch(':username')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  async updateUser(
    @Param() { username }: UserUsernameDto,
    @Body() { username: newUsername, password: newPassword }: UpdateUserReqDto,
    @Req() req: Request,
  ) {
    if (!this.hasPermission(req.user, 'updateUser')) {
      throw new ForbiddenException('Permission denied');
    }

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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete(':username')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async removeUser(
    @Param() { username }: UserUsernameDto,
    @Req() req: Request,
  ) {
    if (!this.hasPermission(req.user, 'deleteUser')) {
      throw new ForbiddenException('Permission denied');
    }

    const deletedCount = await this.usersService.deleteUser(username);
    if (deletedCount === 0) {
      throw new BadRequestException(
        formatError(this.configService, 'Failed to delete user', null),
      );
    }
    return { success: `User ${username} deleted` };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Patch(':username/permissions')
  @ApiResponse({
    status: 200,
    description: 'The user permissions have been successfully updated.',
  })
  async updateUserPermissions(
    @Param() { username }: UserUsernameDto,
    @Body() { permissions }: UserPermissionReqDto,
    @Req() req: Request,
  ) {
    if (!this.hasPermission(req.user, 'updateUser')) {
      throw new ForbiddenException('Permission denied');
    }

    if (!Array.isArray(permissions)) {
      throw new BadRequestException('Permissions should be an array');
    }

    try {
      const updatedUser = await this.usersService.updateUserPermissions(
        username,
        permissions,
      );
      return { success: 'User permissions updated', user: updatedUser };
    } catch (error) {
      throw new BadRequestException(
        formatError(
          this.configService,
          'Failed to update user permissions',
          error,
        ),
      );
    }
  }
}
