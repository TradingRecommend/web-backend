import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Company from '../../entities/company.entity';
import Industry from '../../entities/industry.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(Industry)
    private industryRepo: Repository<Industry>,
  ) {}

  async create(createDto: {
    symbol: string;
    name: string;
    industryId: number;
    description?: string;
  }) {
    const industry = await this.industryRepo.findOne({
      where: { id: createDto.industryId },
    });
    if (!industry) throw new NotFoundException('Industry not found');
    const company = this.companyRepo.create({
      symbol: createDto.symbol,
      name: createDto.name,
      industry: industry,
      description: createDto.description,
    });
    return this.companyRepo.save(company);
  }

  /**
   * Find companies with pagination.
   * @param symbol filter by symbol (partial match)
   * @param industry filter by industry ID
   * @param order 'ASC' | 'DESC' for sorting by symbol
   * @param page 1-based page number (default 1)
   * @param limit items per page (default 20)
   * @returns { data: Company[]; total: number; page: number; limit: number }
   */
  async find(
    symbol?: string,
    industry?: string,
    order?: 'ASC' | 'DESC',
    page = 1,
    limit = 20,
  ) {
    let whereClause: any = {};

    if (symbol) {
      whereClause.symbol = Like(`%${symbol}%`);
    }

    if (industry) {
      whereClause = {
        ...whereClause,
        industry: {
          id: `${industry}`,
        },
      };
    }

    const [data, total] = await this.companyRepo.findAndCount({
      where: whereClause,
      order: {
        symbol: order || 'ASC',
      },
      relations: ['industry'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: data,
      total,
      page: page,
      limit: limit,
    };
  }

  async findOne(symbol: string) {
    const company = await this.companyRepo.findOne({ where: { symbol } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(
    symbol: string,
    updateDto: Partial<{
      name: string;
      industryId: number;
      description: string;
    }>,
  ) {
    const company = await this.findOne(symbol);
    if (updateDto.industryId) {
      const industry = await this.industryRepo.findOne({
        where: { id: updateDto.industryId },
      });
      if (!industry) throw new NotFoundException('Industry not found');
      company.industry = industry;
    }
    if (updateDto.name !== undefined) company.name = updateDto.name;
    if (updateDto.description !== undefined)
      company.description = updateDto.description;

    return this.companyRepo.save(company);
  }

  async remove(symbol: string) {
    const company = await this.findOne(symbol);
    return this.companyRepo.remove(company);
  }
}
