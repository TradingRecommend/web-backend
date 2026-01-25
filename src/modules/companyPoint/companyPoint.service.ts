import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CompanyPoint from '../../entities/companyPoint.entity';
import { CreateCompanyPointDto } from './dto/create-companyPoint.dto';
import { UpdateCompanyPointDto } from './dto/update-companyPoint.dto';

@Injectable()
export class CompanyPointService {
  constructor(
    @InjectRepository(CompanyPoint)
    private companyPointRepository: Repository<CompanyPoint>,
  ) {}

  async create(createCompanyPointDto: CreateCompanyPointDto) {
    const companyPoint = this.companyPointRepository.create(
      createCompanyPointDto,
    );
    await this.companyPointRepository.save(companyPoint);
    return companyPoint;
  }

  /**
   * Find company points with pagination.
   * @param date filter by date (partial match)
   * @param symbol filter by symbol (partial match)
   * @param orderBy column to sort by (avg, buffett_avg, canslim_avg, symbol, date)
   * @param order 'ASC' | 'DESC' for sorting by avg
   * @param page 1-based page number (default 1)
   * @param limit items per page (default 20)
   * @returns { data: CompanyPoint[]; total: number; page: number; limit: number }
   */
  async find(
    date?: string,
    symbol?: string,
    orderBy?: string,
    order?: 'ASC' | 'DESC',
    page = 1,
    limit = 20,
  ) {
    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;

    const params = [];
    let subQueryWhereClause = '';

    if (date) {
      params.push(date);
      subQueryWhereClause = `WHERE cp.date = $${params.length}`;
    }

    if (symbol) {
      // Thêm dấu % vào giá trị trước khi push vào params
      params.push(`%${symbol}%`);

      const connector = subQueryWhereClause ? ' AND ' : 'WHERE ';

      // KHÔNG để dấu nháy đơn bao quanh $${params.length}
      subQueryWhereClause += `${connector} cp.symbol LIKE $${params.length}`;
    }

    const subQuery = `
      SELECT date, symbol, standard, AVG(point) as point
      FROM company_point cp
      ${subQueryWhereClause}
      GROUP BY date, symbol, standard
    `;

    const mainQuery = `
      SELECT
        a.date,
        a.symbol,
        AVG(a.point) AS avg,
        MAX(CASE WHEN a.standard = 'BUFFETT' THEN a.point ELSE 0 END) AS buffett_avg,
        MAX(CASE WHEN a.standard = 'CANSLIM' THEN a.point ELSE 0 END) AS canslim_avg
      FROM (${subQuery}) a
      GROUP BY a.date, a.symbol
    `;

    const countQuery = `SELECT COUNT(*) as total FROM (${mainQuery}) count_table`;

    const totalResult = await this.companyPointRepository.query(
      countQuery,
      params,
    );
    const total = totalResult[0].total;

    // Whitelist columns to prevent SQL injection
    const allowedColumns = [
      'symbol',
      'avg',
      'buffett_avg',
      'canslim_avg',
      'date',
    ];
    let orderByClause = '';
    if (orderBy && allowedColumns.includes(orderBy)) {
      const sortOrder = order || 'DESC';
      orderByClause = `ORDER BY "${orderBy}" ${sortOrder}`;
    }

    params.push(take);
    let paginationClause = `LIMIT $${params.length} `;
    params.push(skip);
    paginationClause += `OFFSET $${params.length} `;

    const dataQuery = `
      ${mainQuery}
      ${orderByClause}
      ${paginationClause}
    `;

    const data = await this.companyPointRepository.query(dataQuery, params);

    return {
      items: data,
      total: Number(total),
      page,
      limit: take,
    };
  }

  async findOne(date: string, symbol: string, standard: string, code: string) {
    const companyPoint = await this.companyPointRepository.findOne({
      where: { date, symbol, standard, code },
    });
    if (!companyPoint) {
      throw new NotFoundException(`CompanyPoint not found`);
    }
    return companyPoint;
  }

  // New method to find detail by date and symbol
  async findDetail(date: string, symbol: string) {
    const companyPoints = await this.companyPointRepository.find({
      where: { date, symbol },
    });

    // Khởi tạo cấu trúc trả về mặc định
    const result = {
      date,
      symbol,
      scores: {},
      averages: {
        overall: 0,
        standards: {},
      },
    };

    if (!companyPoints?.length) return result;

    const tempStats = {};

    // Sử dụng một vòng lặp duy nhất để nhóm và tính toán sơ bộ
    for (const { standard, code, point, description } of companyPoints) {
      // 1. Nhóm scores
      if (!result.scores[standard]) {
        result.scores[standard] = {};
        tempStats[standard] = { sum: 0, count: 0 };
      }
      result.scores[standard][code] = { point, description };

      // 2. Tích lũy để tính trung bình theo standard
      tempStats[standard].sum += point;
      tempStats[standard].count += 1;
    }

    // Tính trung bình (vòng lặp này ngắn hơn nhiều vì chỉ lặp qua số lượng standard)
    const standardNames = Object.keys(tempStats);
    let totalStandardAverages = 0;

    for (const std of standardNames) {
      const avg = tempStats[std].sum / tempStats[std].count;
      result.averages.standards[std] = avg;
      totalStandardAverages += avg;
    }

    if (standardNames.length > 0) {
      result.averages.overall = totalStandardAverages / standardNames.length;
    }

    return result;
  }

  async update(
    date: string,
    symbol: string,
    standard: string,
    criteriaCode: string,
    updateCompanyPointDto: UpdateCompanyPointDto,
  ) {
    const companyPoint = await this.findOne(
      date,
      symbol,
      standard,
      criteriaCode,
    );
    companyPoint.point = updateCompanyPointDto.point;
    return this.companyPointRepository.save(companyPoint);
  }

  async remove(
    date: string,
    symbol: string,
    standard: string,
    criteriaCode: string,
  ) {
    const companyPoint = await this.findOne(
      date,
      symbol,
      standard,
      criteriaCode,
    );
    return this.companyPointRepository.remove(companyPoint);
  }
}
