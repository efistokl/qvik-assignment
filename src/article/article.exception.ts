export class ArticleException extends Error {}
export class ArticleExistsException extends ArticleException {
  constructor() {
    super('Article with given URL already exists');
  }
}
