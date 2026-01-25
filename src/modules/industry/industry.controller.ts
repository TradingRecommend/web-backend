import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../entities/role.entity';
import RolesGuard from '../auth/guard/roles.guard';
import { IndustryService } from './industry.service';

@Controller('industry')
@ApiTags('Industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  async create(@Body() body: { name: string }) {
    return this.industryService.create(body);
  }

  @Get()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  async findAll() {
    return this.industryService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  async findOne(@Param('id') id: string) {
    return this.industryService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string }>,
  ) {
    return this.industryService.update(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  async remove(@Param('id') id: string) {
    return this.industryService.remove(Number(id));
  }
}
