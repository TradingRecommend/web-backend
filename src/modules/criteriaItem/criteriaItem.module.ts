import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriaItemService } from './criteriaItem.service';
import { CriteriaItemController } from './criteriaItem.controller';
import CriteriaItem from '../../entities/criteriaItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CriteriaItem])],
  providers: [CriteriaItemService],
  controllers: [CriteriaItemController],
  exports: [CriteriaItemService],
})
export class CriteriaItemModule {}
