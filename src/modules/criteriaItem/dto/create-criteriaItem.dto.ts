import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCriteriaItemDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  standard: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
