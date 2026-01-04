import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public code: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public price: number;
}

export default Product;
