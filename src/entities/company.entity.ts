import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export default class Company {
  @PrimaryColumn()
  symbol: string;

  @Column()
  name: string;

  @Column()
  industry: number;

  @Column({ nullable: true })
  description: string;
}
