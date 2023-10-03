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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const existingUser = await this.usersService.getUser(body.username);
    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }

    const createdUser = await this.usersService.createUser(
      body.username,
      body.password,
    );

    const loginResponse = await this.authService.login(
      createdUser.username,
      body.password,
    );

    return {
      success: 'User created successfully',
      user: createdUser,
      token: loginResponse,
    };
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
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
