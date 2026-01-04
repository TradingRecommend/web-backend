import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Industry from '../../entities/industry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IndustryService {
  constructor(
    @InjectRepository(Industry)
    private industryRepo: Repository<Industry>,
  ) {}

  async create(createDto: { name: string }) {
    const industry = this.industryRepo.create(createDto);
    return this.industryRepo.save(industry);
  }

  async findAll() {
    const data = await this.industryRepo.find();

    return { items: data, total: data.length };
  }

  async findOne(id: number) {
    const industry = await this.industryRepo.findOne({ where: { id } });
    if (!industry) throw new NotFoundException('Industry not found');
    return industry;
  }

  async update(id: number, updateDto: Partial<{ name: string }>) {
    const industry = await this.findOne(id);
    Object.assign(industry, updateDto);
    return this.industryRepo.save(industry);
  }

  async remove(id: number) {
    const industry = await this.findOne(id);
    return this.industryRepo.remove(industry);
  }
}
