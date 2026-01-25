import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export default class CriteriaItem {
  @PrimaryColumn()
  standard: string;

  @PrimaryColumn()
  code: string;

  @Column()
  name: string;
}
