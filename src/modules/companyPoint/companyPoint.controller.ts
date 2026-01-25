import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CompanyPointService } from './companyPoint.service';
import { CreateCompanyPointDto } from './dto/create-companyPoint.dto';
import { UpdateCompanyPointDto } from './dto/update-companyPoint.dto';
import { ApiTags } from '@nestjs/swagger';
import RolesGuard from '../auth/guard/roles.guard';
import { Roles } from '../../entities/role.entity';

@Controller('company-point')
@ApiTags('Company Point')
export class CompanyPointController {
  constructor(private readonly companyPointService: CompanyPointService) {}

  @Post()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  create(@Body() createCompanyPointDto: CreateCompanyPointDto) {
    return this.companyPointService.create(createCompanyPointDto);
  }

  @Get()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  find(
    @Query('date') date?: string,
    @Query('symbol') symbol?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.companyPointService.find(
      date,
      symbol,
      orderBy,
      order,
      +page,
      +limit,
    );
  }

  @Get(':symbol/:date/detail')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  findDetail(@Param('date') date: string, @Param('symbol') symbol: string) {
    return this.companyPointService.findDetail(date, symbol);
  }

  @Patch()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  update(
    @Query('date') date: string,
    @Query('symbol') symbol: string,
    @Query('standard') standard: string,
    @Query('criteriaCode') criteriaCode: string,
    @Body() updateCompanyPointDto: UpdateCompanyPointDto,
  ) {
    return this.companyPointService.update(
      date,
      symbol,
      standard,
      criteriaCode,
      updateCompanyPointDto,
    );
  }

  @Delete()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  remove(
    @Query('date') date: string,
    @Query('symbol') symbol: string,
    @Query('standard') standard: string,
    @Query('criteriaCode') criteriaCode: string,
  ) {
    return this.companyPointService.remove(
      date,
      symbol,
      standard,
      criteriaCode,
    );
  }
}
