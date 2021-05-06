import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from 'eventemitter2';
import { EntityRepository } from 'typeorm';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';

jest.mock('eventemitter2', () => {
  return {
    EventEmitter2: jest.fn().mockImplementation(() => {
      return { emit: jest.fn() };
    }),
  };
});

@EntityRepository(Article)
class MockArticleRepositorySave {
  create({ url, wordCount = null }) {
    const article = new Article();
    article.url = url;
    article.wordCount = wordCount;
    return Promise.resolve(article);
  }

  save(article: Article) {
    article.id = 1;
    return Promise.resolve(article);
  }
}

describe('ArticleService', () => {
  const eventEmitter = new EventEmitter2();
  let service: ArticleService;

  beforeEach(async () => {
    const mockRepository = new MockArticleRepositorySave();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitter,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  test('#create: article.newArticleAdded event fired', () => {
    const dto = new CreateArticleDto();
    dto.url = 'https://testurl.com';

    return service.create(dto).then(() => {
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'article.newArticleAdded',
        expect.anything(),
      );
    });
  });
});
