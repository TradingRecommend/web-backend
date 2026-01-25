import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PredictionResult from '../../entities/predictResult.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import StockFeature from '../../entities/stockFeature.entity';
import { format, parse, subMonths } from 'date-fns';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(PredictionResult)
    private predictResultRepo: Repository<PredictionResult>,
    @InjectRepository(StockFeature)
    private stockFeatureRepo: Repository<StockFeature>,
  ) {}

  async find(query: {
    symbol?: string;
    version?: string;
    type?: string;
    page: number;
    limit: number;
  }) {
    const { symbol, version, type, page, limit } = query;
    const where: any = {};
    if (symbol) {
      where.symbol = symbol;
    }
    if (version) {
      where.version = version;
    }
    if (type) {
      where.type = type;
    }

    const [data, total] = await this.predictResultRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: data,
      total,
      page,
      limit,
    };
  }

  async findTopPredictions(query: {
    evaluateDate: string;
    page: number;
    limit: number;
  }) {
    const { evaluateDate, page, limit } = query;
    if (!evaluateDate) throw new Error('evaluateDate is required');

    const dateObj = parse(evaluateDate, 'yyyyMMdd', new Date());
    const sixMonthsAgoString = format(subMonths(dateObj, 6), 'yyyyMMdd');

    // 1. Tạo QueryBuilder chính
    const queryBuilder = this.predictResultRepo
      .createQueryBuilder('prediction')
      .leftJoin(
        'stock_feature',
        'stockAtPredictionDate',
        'prediction.symbol = "stockAtPredictionDate".symbol AND prediction.date = "stockAtPredictionDate".date',
      )
      // Join với bảng stock_feature để lấy ngày gần nhất <= evaluateDate
      .leftJoin(
        'stock_feature',
        'stockAtEvaluateDate',
        'prediction.symbol = "stockAtEvaluateDate".symbol AND "stockAtEvaluateDate".date = (' +
          'SELECT MAX(sf2.date) FROM stock_feature sf2 ' +
          'WHERE sf2.symbol = prediction.symbol AND sf2.date <= :evaluateDate' +
          ')',
        { evaluateDate },
      )
      .where('prediction.date >= :date', { date: sixMonthsAgoString })
      .andWhere('prediction.prediction >= :prediction', { prediction: 0.85 })
      .orderBy('prediction.date', 'DESC')
      .addOrderBy('prediction.prediction', 'DESC');

    // 2. Thực thi lấy dữ liệu
    const [rawData, total] = await Promise.all([
      queryBuilder
        .select([
          'prediction.date AS "predictionDate"',
          'prediction.symbol AS "symbol"',
          'prediction.prediction AS "prediction"',
          'prediction.version AS "version"',
          'stockAtPredictionDate.close AS "priceAtPredictionDate"',
          'stockAtEvaluateDate.date AS "evaluateDate"',
          'stockAtEvaluateDate.close AS "priceAtEvaluateDate"',
          // Tính ratio, dùng NULLIF để tránh chia cho 0
          '("stockAtEvaluateDate".close - "stockAtPredictionDate".close) / NULLIF("stockAtPredictionDate".close, 0) AS "ratio"',
        ])
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany(),

      queryBuilder.getCount(),
    ]);

    return {
      items: rawData,
      total,
      page,
      limit,
    };
  }
}
