import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class CompanyPoint {
  @PrimaryColumn()
  date: string;

  @PrimaryColumn()
  symbol: string;

  @PrimaryColumn()
  standard: string;

  @PrimaryColumn()
  code: string;

  @Column({ type: 'float' })
  point: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
