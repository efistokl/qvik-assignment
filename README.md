# My Mind API - Qvik Assignment

## Description

Assignment description is in REQUIREMENTS.md.

Browserable API-UI is available at `/docs` endpoint.

## Running the app

```bash
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

Navigate to http://localhost:3000/docs to browse Swagger UI

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes. Fullfilment of the requirements

### Able to manage channels.

- GET /channel

- GET /channel/:id

  Gets the specific channel and also lists the articles for the channel

- POST /channel

- PATCH /channel/:id

- DELETE /channel/:id

### Able to manage articles for a channel.

Channel-Article is a Many-To-Many relation.

- PUT /channel/:id/postArticle/:articleId

- PUT ​/channel​/:id​/unpostArticle​/:articleId

### Adding articles and word counting

> When adding articles, only the URL is required. The Application will fetch the URL and calculate the word count (HTML tags stripped). Fetching the URLs and counting the words is to be done in the background after the article URL has been received.

- POST /article

  Returns newly created article object, word counting started in the background

- GET /article/:id

  wordCount property will be set if the word count was completed

### Can search articles within word count ranges e.g. 0-100, 100-500, 0-501.

- GET /article?minWordCount=...&maxWordCount=...

### Example flow

- Create articles and channels using POST /channel, POST /article
- Bind a few channels and articles using PUT /channel/:id/postArticle/:articleId
- Check bindings by querying data using GET /channel/:id, GET /article/:id
- Check word count values by querying articles using GET /article
- Search for articles by word range using GET /article with query params

## Remaining Issues(?)

- In case the word count fails the current behavior is set to delete the "faulty" article. The "correct" behavior is not defined.

- If the database is changed to something other than in-memory:

  - Add unit/e2e tests for graceful shutdown if word-counting is in progress.

  - Consider making "create article" + "word count" a transaction.
