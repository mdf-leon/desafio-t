import { ApiProperty } from '@nestjs/swagger';

export class CreateUserReqDto {
  @ApiProperty({
    description: 'The Username to create',
  })
  username: string;

  @ApiProperty({
    description: 'The Password to create',
  })
  password: string;
}

export class LoginUserReqDto {
  @ApiProperty({
    description: 'The Username to login',
  })
  username: string;

  @ApiProperty({
    description: 'The Password to login',
  })
  password: string;
}

export class UpdateUserReqDto {
  @ApiProperty({
    description: 'The Username to update',
  })
  username: string;

  @ApiProperty({
    description: 'The Password to update',
  })
  password: string;
}

export class UserDto {
  @ApiProperty({
    description: 'The ID of the User',
  })
  id: string;

  @ApiProperty({
    description: 'The Username of the User',
  })
  username: string;

  @ApiProperty({
    description: 'The Password of the User',
  })
  password: string;
}

export class UserUsernameDto {
  @ApiProperty({
    description: 'The username of the User',
  })
  username: string;
}

export class UserPermissionReqDto {
  @ApiProperty({
    description: 'The permission to check',
    enum: [
      'changePermissions',
      'createUser',
      'readUser',
      'updateUser',
      'deleteUser',
    ],
    type: 'array',
    example: [
      'changePermissions',
      'createUser',
      'readUser',
      'updateUser',
      'deleteUser',
    ],
  })
  permissions: string[];
}
