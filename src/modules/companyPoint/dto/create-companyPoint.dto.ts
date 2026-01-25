import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCompanyPointDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  standard: string;

  @IsString()
  @IsNotEmpty()
  criteriaCode: string;

  @IsNumber()
  @IsNotEmpty()
  point: number;
}
