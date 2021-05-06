import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsUrl()
  url: string;
}
