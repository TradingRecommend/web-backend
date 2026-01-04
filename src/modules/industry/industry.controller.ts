import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IndustryService } from './industry.service';

@Controller('industry')
@ApiTags('Industry')
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  async create(@Body() body: { name: string }) {
    return this.industryService.create(body);
  }

  @Get()
  async findAll() {
    return this.industryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.industryService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string }>,
  ) {
    return this.industryService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.industryService.remove(Number(id));
  }
}
