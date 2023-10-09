import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [
    ConfigModule,
    // UsersGateway,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
