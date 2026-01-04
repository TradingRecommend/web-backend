import { Module } from '@nestjs/common';
import CustomLogger from './customLogger';
import { ConfigModule } from '@nestjs/config';
import LogsService from './logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([])],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}
