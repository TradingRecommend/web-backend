import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
class PredictionResult {
  @PrimaryColumn()
  public date: string;

  @PrimaryColumn()
  public symbol: string;

  @PrimaryColumn()
  public version: string;

  @PrimaryColumn()
  public type: string;

  @Column('float')
  public prediction: number;
}

export default PredictionResult;
