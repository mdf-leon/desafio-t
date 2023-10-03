import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.usersService.getUser(username, true);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      return this.jwtService.sign(payload);
    } else {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  async validateUser(username: string) {
    const user = await this.usersService.getUser(username);
    if (user) {
      return user;
    }
    return null;
  }
}
