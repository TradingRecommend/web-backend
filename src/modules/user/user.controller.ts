import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../../configs/decorators/catchError';
import { Roles } from '../../entities/role.entity';
import User from '../../entities/user.entity';
import RolesGuard from '../auth/guard/roles.guard';
import UpdateUserDto from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@UseGuards(RolesGuard([Roles.SYSTEMADMIN]))
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Get user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Get user unsuccessfully',
  })
  async getUserByEmail(@Query() queries) {
    const { email } = queries;
    const users = this.usersService.getByEmail(email);
    return users;
  }

  @Patch('/:userId')
  @UseFilters(AllExceptionsFilter)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Update user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Update user unsuccessfully',
  })
  async updateUserById(
    @Req() request,
    @Param() params,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = params;
    const updatedUser = await this.usersService.updateUserById(
      Number(userId),
      updateUserDto,
    );
    return updatedUser;
  }
}
