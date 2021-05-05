export class ChannelException extends Error {}
export class ChannelNotFoundException extends ChannelException {
  constructor() {
    super('Channel not found');
  }
}
export class ChannelExistsException extends ChannelException {
  constructor() {
    super('Channel with given name already exists');
  }
}
export class ArticleNotFoundException extends ChannelException {
  constructor() {
    super('Cannot add a non-existent article to the channel');
  }
}
