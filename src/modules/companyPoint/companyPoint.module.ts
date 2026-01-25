import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPointService } from './companyPoint.service';
import { CompanyPointController } from './companyPoint.controller';
import CompanyPoint from '../../entities/companyPoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyPoint])],
  providers: [CompanyPointService],
  controllers: [CompanyPointController],
  exports: [CompanyPointService],
})
export class CompanyPointModule {}
