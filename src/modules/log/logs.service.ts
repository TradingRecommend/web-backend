import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/createLog.dto';

@Injectable()
export default class LogsService {
  async createLog(log: CreateLogDto) {
    // const newLog = await this.logsRepository.create(log);
    // await this.logsRepository.save(newLog, {
    //   data: {
    //     isCreatingLogs: true,
    //   },
    // });
    // return newLog;
  }
}
