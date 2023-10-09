import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockUsersService = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      updateUserPermissions: jest.fn(),
    };

    mockConfigService = {};

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('addUser', () => {
    it('should throw ForbiddenException if user lacks permission', async () => {
      await expect(
        usersController.addUser({ username: 'test_x', password: 'x' }, {
          user: { permissions: [] },
        } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create and return a new user', async () => {
      const mockUser = { username: 'alice' };
      mockUsersService.createUser.mockResolvedValue(mockUser);
      const response = await usersController.addUser(
        { username: 'alice', password: 'pass' },
        { user: { permissions: ['createUser'] } } as any,
      );
      expect(response).toEqual({
        success: 'User created successfully',
        user: mockUser,
      });
    });
  });

  describe('getAllUsers', () => {
    it('should throw ForbiddenException if user lacks permission', async () => {
      try {
        await usersController.getAllUsers({ user: { permissions: [] } } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Permission denied');
      }
    });

    it('should successfully retrieve all users', async () => {
      const mockUsers = [{ username: 'alice' }, { username: 'bob' }];
      mockUsersService.getAllUsers.mockResolvedValue(mockUsers);

      const response = await usersController.getAllUsers({
        user: { permissions: ['readUser'] },
      } as any);
      expect(response).toEqual({
        success: 'Users were found',
        users: mockUsers,
      });
    });
  });

  describe('getUser', () => {
    it('should throw ForbiddenException if user lacks permission', async () => {
      try {
        await usersController.getUser({ username: 'alice' }, {
          user: { permissions: [] },
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should retrieve a specific user', async () => {
      const mockUser = { username: 'alice' };
      mockUsersService.getUser.mockResolvedValue(mockUser);

      const response = await usersController.getUser({ username: 'alice' }, {
        user: { permissions: ['readUser'] },
      } as any);
      expect(response).toEqual({
        success: 'User found',
        user: mockUser,
      });
    });
  });

  describe('updateUser', () => {
    it('should throw ForbiddenException if user lacks permission', async () => {
      await expect(
        usersController.updateUser(
          { username: 'alice' },
          { username: 'bob', password: 'pass' },
          { user: { permissions: [] } } as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update and return the user', async () => {
      const mockUpdatedUser = { username: 'bob' };
      mockUsersService.updateUser.mockResolvedValue(mockUpdatedUser);
      const response = await usersController.updateUser(
        { username: 'alice' },
        { username: 'bob', password: 'pass' },
        { user: { permissions: ['updateUser'] } } as any,
      );
      expect(response).toEqual({
        success: 'User updated',
        user: mockUpdatedUser,
      });
    });
  });

  describe('removeUser', () => {
    it('should throw ForbiddenException if user lacks permission', async () => {
      await expect(
        usersController.removeUser({ username: 'alice' }, {
          user: { permissions: [] },
        } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should delete the user and return success', async () => {
      mockUsersService.deleteUser.mockResolvedValue(1);
      const response = await usersController.removeUser({ username: 'alice' }, {
        user: { permissions: ['deleteUser'] },
      } as any);
      expect(response).toEqual({ success: 'User alice deleted' });
    });
  });

  describe('updateUserPermissions', () => {
    it('should throw ForbiddenException if user lacks permission', async () => {
      await expect(
        usersController.updateUserPermissions(
          { username: 'alice' },
          { permissions: ['readUser'] },
          { user: { permissions: [] } } as any,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if permissions is not an array', async () => {
      await expect(
        usersController.updateUserPermissions(
          { username: 'alice' },
          { permissions: 'readUser' } as any,
          { user: { permissions: ['updateUser'] } } as any,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update the user permissions and return the updated user', async () => {
      const mockUserWithUpdatedPermissions = {
        username: 'alice',
        permissions: ['readUser'],
      };
      mockUsersService.updateUserPermissions.mockResolvedValue(
        mockUserWithUpdatedPermissions,
      );
      const response = await usersController.updateUserPermissions(
        { username: 'alice' },
        { permissions: ['readUser'] },
        { user: { permissions: ['updateUser'] } } as any,
      );
      expect(response).toEqual({
        success: 'User permissions updated',
        user: mockUserWithUpdatedPermissions,
      });
    });
  });
});
