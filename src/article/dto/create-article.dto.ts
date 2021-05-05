import { IsUrl } from 'class-validator';

export class CreateArticleDto {
  @IsUrl()
  url: string;
}
