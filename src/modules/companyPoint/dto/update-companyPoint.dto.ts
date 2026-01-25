import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateCompanyPointDto {
  @IsNumber()
  @IsNotEmpty()
  point: number;
}
