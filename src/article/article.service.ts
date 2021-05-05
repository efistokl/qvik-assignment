import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUniqueConstraintErrorSqlite } from '../helpers/sqliteErrors.helper';
import { Repository } from 'typeorm';
import { ArticleExistsException } from './article.exception';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = await this.articleRepository.create({
      url: createArticleDto.url,
      wordCount: null,
    });

    try {
      return await this.articleRepository.save(article);
      // TODO: schedule a job to calculate word count. Maybe defer saving as well
    } catch (error) {
      if (isUniqueConstraintErrorSqlite(error)) {
        throw new ArticleExistsException();
      } else {
        throw error;
      }
    }
  }

  findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  findOne(id: number) {
    return this.articleRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
