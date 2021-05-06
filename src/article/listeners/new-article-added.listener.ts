import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { StaticPool } from 'node-worker-threads-pool';
import * as path from 'path';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { NewArticleAddedEvent } from '../events/new-article-added.event';

@Injectable()
export class NewArticleAddedListener {
  private wordCounterWorkerPool: any;

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {
    this.wordCounterWorkerPool = new StaticPool({
      size: 4,
      task: path.resolve(
        './src/article/workers/calculateWordCountForUrl.worker.js',
      ),
    });
  }

  onModuleDestroy() {
    this.wordCounterWorkerPool.destroy();
  }

  @OnEvent('article.newArticleAdded')
  async handleNewArticleAdded(event: NewArticleAddedEvent) {
    const { articleId, url } = event;

    try {
      const { error, wordCount } = await this.wordCounterWorkerPool.exec(url);
      if (error) {
        throw error;
      }

      const article = await this.articleRepository.findOne(articleId);

      if (article === undefined) {
        return;
      }

      article.wordCount = wordCount;

      await this.articleRepository.save(article);
    } catch (error) {
      console.error(
        'Error when performing word count on the article. It will be removed.',
      );
      console.error(error);
      await this.articleRepository.delete(articleId);
    }
  }
}
