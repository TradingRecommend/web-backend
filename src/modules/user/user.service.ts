import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role, { Roles } from '../../entities/role.entity';
import { In, Repository } from 'typeorm';
import User from '../../entities/user.entity';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../entities/userRole.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  private _transformUser(user: User): User {
    if (user && user.userRoles) {
      (user as any).roles = user.userRoles.map((ur) => ur.role.name);
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (user) {
      return this._transformUser(user);
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (user) {
      return this._transformUser(user);
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async createUser(userData: CreateUserDto) {
    const { email, name, password, roles } = userData;

    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = await bcrypt.hash(password, 10);

    const savedUser = await this.usersRepository.save(newUser);

    let roleEntities: Role[] = [];
    if (roles && roles.length > 0) {
      roleEntities = await this.roleRepository.find({
        where: {
          name: In(roles),
        },
      });
    } else {
      const role = await this.roleRepository.findOne({
        where: {
          name: Roles.MEMBER,
        },
      });
      if (role) {
        roleEntities.push(role);
      }
    }

    const userRoles = roleEntities.map((role) => {
      const userRole = new UserRole();
      userRole.roleId = role.id;
      userRole.userId = savedUser.id;
      return userRole;
    });

    await this.userRoleRepository.save(userRoles);

    return this.getById(savedUser.id);
  }

  public async updateUserById(userId: number, userData: UpdateUserDto) {
    const user = await this.getById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Update basic user info
    await this.usersRepository.update({ id: userId }, { name: userData.name });

    return this.getById(userId);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    if (!user.currentHashedRefreshToken) {
      return;
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
