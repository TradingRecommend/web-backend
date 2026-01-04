import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';

@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
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

  @Get()
  async find(@Query() query) {
    const { page, limit } = query || {};
    return this.companyService.find(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get(':symbol')
  async findOne(@Param('symbol') symbol: string) {
    return this.companyService.findOne(symbol);
  }

  @Patch(':symbol')
  async update(
    @Param('symbol') symbol: string,
    @Body()
    body: Partial<{ name: string; industryId: number; description: string }>,
  ) {
    return this.companyService.update(symbol, body);
  }

  @Delete(':symbol')
  async remove(@Param('symbol') symbol: string) {
    return this.companyService.remove(symbol);
  }
}
