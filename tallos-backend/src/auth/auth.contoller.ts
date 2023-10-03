import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { formatError } from '../utils/error.utils';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async register(@Body() { username, password }: CreateUserDto) {
    const existingUser = await this.usersService.getUser(username);
    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }

    const createdUser = await this.usersService.createUser(username, password);

    const loginResponse = await this.authService.login(
      createdUser.username,
      password,
    );

    return {
      success: 'User created successfully',
      user: createdUser,
      token: loginResponse,
    };
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
  })
  async login(@Body() { username, password }: LoginUserDto) {
    try {
      const token = await this.authService.login(username, password);
      return { success: 'Login successful', token };
    } catch (error) {
      throw new UnauthorizedException(
        formatError(this.configService, 'Login failed', error),
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  async verify() {
    return { success: 'Token is valid' };
  }
}
