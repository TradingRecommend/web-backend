import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../entities/role.entity';
import RolesGuard from '../auth/guard/roles.guard';
import { CompanyService } from './company.service';

@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  async create(
    @Body()
    body: {
      symbol: string;
      name: string;
      industryId: number;
      description?: string;
    },
  ) {
    return this.companyService.create(body);
  }

  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  @Get()
  async find(
    @Query('symbol') symbol?: string,
    @Query('industry') industry?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.companyService.find(symbol, industry, order, +page, +limit);
  }

  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  @Get(':symbol')
  async findOne(@Param('symbol') symbol: string) {
    return this.companyService.findOne(symbol);
  }

  @Patch(':symbol')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  async update(
    @Param('symbol') symbol: string,
    @Body()
    body: Partial<{ name: string; industryId: number; description: string }>,
  ) {
    return this.companyService.update(symbol, body);
  }

  @Delete(':symbol')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  async remove(@Param('symbol') symbol: string) {
    return this.companyService.remove(symbol);
  }
}
