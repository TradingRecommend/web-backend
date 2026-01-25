import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Company from './company.entity';

@Entity()
export default class Industry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Company, (company) => company.industry)
  companies: Company[];
}
