import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.contoller';
import { User } from 'src/users/user.model';

const mockConfigService = {
  get: jest.fn().mockReturnValue('development'),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfigService, // Use the mockConfigService here
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto = { username: 'test', password: 'pass123' };
      jest.spyOn(usersService, 'getUser').mockResolvedValue(null);
      jest
        .spyOn(usersService, 'createUser')
        // make a fake User object
        .mockResolvedValue({
          ...createUserDto,
          id: '123',
          permissions: [],
        } as User);
      jest.spyOn(authService, 'login').mockResolvedValue('sample_token');

      const result = await authController.register(createUserDto);
      expect(result).toEqual({
        success: 'User created successfully',
        user: {
          id: '123',
          username: 'test',
          password: 'pass123',
          permissions: [],
        },
        token: 'sample_token',
      });
    });

    it('should throw ConflictException if username already exists', async () => {
      const createUserDto = { username: 'test', password: 'pass123' };
      jest.spyOn(usersService, 'getUser').mockResolvedValue({
        ...createUserDto,
        id: '123',
        permissions: [],
      } as User);

      await expect(authController.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginUserDto = { username: 'test', password: 'pass123' };
      jest.spyOn(authService, 'login').mockResolvedValue('sample_token');
      jest.spyOn(usersService, 'getUser').mockResolvedValue({
        ...loginUserDto,
        id: '123',
        permissions: [],
      } as User);

      const result = await authController.login(loginUserDto);
      expect(result).toEqual({
        success: 'Login successful',
        user: {
          id: '123',
          username: 'test',
          password: 'pass123',
          permissions: [],
        },
        token: 'sample_token',
      });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginUserDto = { username: 'test', password: 'pass123' };
      jest.spyOn(authService, 'login').mockRejectedValue(new Error());

      await expect(authController.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verify', () => {
    it('should return valid token message', async () => {
      const result = await authController.verify();
      expect(result).toEqual({ success: 'Token is valid' });
    });
  });
});
