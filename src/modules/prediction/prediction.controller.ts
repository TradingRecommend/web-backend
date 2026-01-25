import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PredictionService } from './prediction.service';
import RolesGuard from '../auth/guard/roles.guard';
import { Roles } from 'src/entities/role.entity';

@Controller('prediction')
@ApiTags('Prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get('top/:evaluateDate')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  async findTop(
    @Param('evaluateDate') evaluateDate: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.predictionService.findTopPredictions({
      evaluateDate,
      page: +page,
      limit: +limit,
    });
  }

  @Get()
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  async find(
    @Query('symbol') symbol?: string,
    @Query('version') version?: string,
    @Query('type') type?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.predictionService.find({
      symbol,
      version,
      type,
      page: +page,
      limit: +limit,
    });
  }
}
