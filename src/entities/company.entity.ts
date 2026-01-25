import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import Industry from './industry.entity';

@Entity()
export default class Company {
  @PrimaryColumn()
  symbol: string;

  @Column()
  name: string;

  @ManyToOne(() => Industry, (industry) => industry.companies, {
    createForeignKeyConstraints: false, // <--- THIS IS THE KEY
  })
  @JoinColumn({ name: 'id' })
  industry: Industry;

  @Column({ nullable: true })
  description: string;
}
