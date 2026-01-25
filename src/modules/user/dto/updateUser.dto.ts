import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @ApiProperty()
  name: string;
}

export default UpdateUserDto;
