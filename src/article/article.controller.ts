import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticleExceptionFilter } from './article-exception.filter';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('article')
@UseFilters(new ArticleExceptionFilter())
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Article created' })
  @ApiBadRequestResponse({
    description: 'Validation error or article with given URL exists',
  })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiQuery({
    name: 'minWordCount',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'maxWordCount',
    type: Number,
    required: false,
  })
  @ApiOkResponse({ description: 'Success' })
  findByWordCountRange(
    @Query('minWordCount') minWordCount?: number,
    @Query('maxWordCount') maxWordCount?: number,
  ) {
    if (minWordCount === undefined && maxWordCount === undefined) {
      return this.articleService.findAll();
    }

    return this.articleService.findByWordCountRange(
      +minWordCount || 0,
      +maxWordCount || 0,
    );
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Article found' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Article deleted' })
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
