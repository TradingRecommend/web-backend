import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../../entities/user.entity';
import { UserController } from './user.controller';
import Role from '../../entities/role.entity';
import { UserRole } from '../../entities/userRole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
