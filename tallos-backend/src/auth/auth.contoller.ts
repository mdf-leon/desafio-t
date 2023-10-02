import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
// import { formatError } from 'src/utils/error.utils';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { formatError } from 'src/utils/error.utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    // Check if user exists
    const existingUser = await this.usersService.getUser(body.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists.');
    }

    const createdUser = await this.usersService.createUser(
      body.username,
      body.password,
    );

    const loginResponse = await this.authService.login(
      createdUser.username,
      body.password,
    );

    delete createdUser.password;

    return {
      user: createdUser,
      ...loginResponse,
    };
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const token = await this.authService.login(username, password);
      return { success: 'Login successful', token };
    } catch (error) {
      throw formatError(this.configService, 'Login failed', error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  async verify() {
    return { success: 'Token is valid' };
  }
}
