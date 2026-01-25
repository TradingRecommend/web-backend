import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PredictionResult from '../../entities/predictResult.entity';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import StockFeature from '../../entities/stockFeature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PredictionResult, StockFeature])],
  providers: [PredictionService],
  controllers: [PredictionController],
  exports: [PredictionService],
})
export class PredictionModule {}
