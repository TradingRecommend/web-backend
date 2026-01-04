import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Industry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
