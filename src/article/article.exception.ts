export class ArticleException extends Error {}
export class ArticleExistsException extends ArticleException {
  constructor() {
    super('Article with given URL already exists');
  }
}

export class ArticleNotFoundException extends ArticleException {
  constructor() {
    super('Article not found');
  }
}
