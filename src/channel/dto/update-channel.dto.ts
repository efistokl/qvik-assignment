import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateChannelDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;
}
