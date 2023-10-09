// make the auth dto

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The Username to create',
  })
  username: string;

  @ApiProperty({
    description: 'The Password to create',
  })
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'The Username to login',
  })
  username: string;

  @ApiProperty({
    description: 'The Password to login',
  })
  password: string;
}
