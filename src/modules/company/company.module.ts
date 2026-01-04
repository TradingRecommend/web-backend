import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Company from 'src/entities/company.entity';
import Industry from 'src/entities/industry.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Industry])],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
