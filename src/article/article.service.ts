import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUniqueConstraintErrorSqlite } from '../helpers/sqliteErrors.helper';
import { Repository } from 'typeorm';
import { ArticleExistsException } from './article.exception';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewArticleAddedEvent } from './events/new-article-added.event';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = await this.articleRepository.create({
      url: createArticleDto.url,
      wordCount: null,
    });

    try {
      const newArticle = await this.articleRepository.save(article);

      this.eventEmitter.emit(
        'article.newArticleAdded',
        new NewArticleAddedEvent(newArticle),
      );

      return newArticle;
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
