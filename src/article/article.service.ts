import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUniqueConstraintErrorSqlite } from '../helpers/sqliteErrors.helper';
import { Brackets, Repository } from 'typeorm';
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
    return this.articleRepository.find({
      relations: ['channels'],
    });
  }

  findByWordCountRange(minWordCount = 0, maxWordCount = 0): Promise<Article[]> {
    return this.articleRepository.find({
      relations: ['channels'],
      where: (qb) => {
        // eslint-disable-next-line prettier/prettier
        qb.where('wordCount >= :minWordCount', { minWordCount })
          // eslint-disable-next-line prettier/prettier
          .andWhere(
            new Brackets((qb) => {
              // eslint-disable-next-line prettier/prettier
              qb.where(':maxWordCount = 0', { maxWordCount })
                // eslint-disable-next-line prettier/prettier
                .orWhere('wordCount <= :maxWordCount', { maxWordCount });
            }),
          );
      },
    });
  }

  findOne(id: number) {
    return this.articleRepository.findOne(id, { relations: ['channels'] });
  }

  async remove(id: number): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
