import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CriteriaItem from '../../entities/criteriaItem.entity';
import { CreateCriteriaItemDto } from './dto/create-criteriaItem.dto';

@Injectable()
export class CriteriaItemService {
  constructor(
    @InjectRepository(CriteriaItem)
    private criteriaItemRepository: Repository<CriteriaItem>,
  ) {}

  async create(createCriteriaItemDto: CreateCriteriaItemDto) {
    const criteriaItem = this.criteriaItemRepository.create(
      createCriteriaItemDto,
    );
    await this.criteriaItemRepository.save(criteriaItem);
    return criteriaItem;
  }

  findAll() {
    return this.criteriaItemRepository.find();
  }

  async findOne(code: string, standard: string) {
    const criteriaItem = await this.criteriaItemRepository.findOne({
      where: { code, standard },
    });
    if (!criteriaItem) {
      throw new NotFoundException(
        `CriteriaItem with code ${code} and standard ${standard} not found`,
      );
    }
    return criteriaItem;
  }

  async update(
    code: string,
    standard: string,
    updateCriteriaItemDto: Partial<CreateCriteriaItemDto>,
  ) {
    const criteriaItem = await this.findOne(code, standard);
    this.criteriaItemRepository.merge(criteriaItem, updateCriteriaItemDto);
    return this.criteriaItemRepository.save(criteriaItem);
  }

  async remove(code: string, standard: string) {
    const criteriaItem = await this.findOne(code, standard);
    return this.criteriaItemRepository.remove(criteriaItem);
  }
}
