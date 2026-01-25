import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CriteriaItemService } from './criteriaItem.service';
import { CreateCriteriaItemDto } from './dto/create-criteriaItem.dto';
import { ApiTags } from '@nestjs/swagger';
import RolesGuard from '../auth/guard/roles.guard';
import { Roles } from '../../entities/role.entity';

@Controller('criteria-item')
@ApiTags('Criteria Item')
export class CriteriaItemController {
  constructor(private readonly criteriaItemService: CriteriaItemService) {}

  @Post()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  create(@Body() createCriteriaItemDto: CreateCriteriaItemDto) {
    return this.criteriaItemService.create(createCriteriaItemDto);
  }

  @Get()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  findAll() {
    return this.criteriaItemService.findAll();
  }

  @Get(':code/:standard')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  findOne(@Param('code') code: string, @Param('standard') standard: string) {
    return this.criteriaItemService.findOne(code, standard);
  }

  @Patch(':code/:standard')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  update(
    @Param('code') code: string,
    @Param('standard') standard: string,
    @Body() updateCriteriaItemDto: Partial<CreateCriteriaItemDto>,
  ) {
    return this.criteriaItemService.update(
      code,
      standard,
      updateCriteriaItemDto,
    );
  }

  @Delete(':code/:standard')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN]))
  remove(@Param('code') code: string, @Param('standard') standard: string) {
    return this.criteriaItemService.remove(code, standard);
  }
}
