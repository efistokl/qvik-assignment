import { Article } from '../entities/article.entity';

export class NewArticleAddedEvent {
  articleId: number;
  url: string;

  constructor(article: Article) {
    this.articleId = article.id;
    this.url = article.url;
  }
}
