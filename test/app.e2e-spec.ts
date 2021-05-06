import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  test('/healthz (GET)', () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect('ok');
  });

  test('Channel CRUD', async () => {
    const server = app.getHttpServer();
    const channelName = 'Science Channel';
    const newChannelName = 'Science';

    await request(server).get('/channel').expect(200).expect([]);

    await request(server)
      .post('/channel')
      .send({
        name: channelName,
      })
      .expect(201);

    await request(server)
      .post('/channel')
      .send({
        name: channelName,
      })
      .expect(400);

    const id = await request(server)
      .get('/channel')
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toEqual(channelName);
        return response.body[0].id;
      });

    await request(server)
      .patch(`/channel/${id}`)
      .send({ name: newChannelName })
      .expect(200);

    await request(server)
      .get(`/channel/${id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual(newChannelName);
      });

    await request(server).del(`/channel/${id}`).expect(200);

    await request(server).get('/channel').expect(200).expect([]);
  });

  test('Adding and removing articles to a channel', async () => {
    const server = app.getHttpServer();
    const channelName = 'Science Channel';
    const articleUrl =
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find';
    const wordCountTimeoutMs = 3000;

    const channelId = await request(server)
      .post('/channel')
      .send({
        name: channelName,
      })
      .expect(201)
      .then((response) => response.body.id);

    const articleId = await request(server)
      .post('/article')
      .send({
        url: articleUrl,
      })
      .expect(201)
      .then((response) => response.body.id);

    await request(server)
      .put(`/channel/${channelId}/postArticle/${articleId}`)
      .expect(200);
    // Idempotency: should have no effect
    await request(server)
      .put(`/channel/${channelId}/postArticle/${articleId}`)
      .expect(200);

    await request(server)
      .get(`/channel/${channelId}`)
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(1);
        expect(articles[0].id).toEqual(articleId);
      });

    await request(server)
      .put(`/channel/${channelId}/unpostArticle/${articleId}`)
      .expect(200);

    await request(server)
      .put(`/channel/${channelId}/unpostArticle/${articleId}`)
      .expect(200);

    await request(server)
      .get(`/channel/${channelId}`)
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(0);
      });

    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        request(server)
          .get(`/article/${articleId}`)
          .expect(200)
          .then((response) => {
            const wordCount = response.body.wordCount;
            expect(wordCount).toBeGreaterThan(0);
            resolve();
          })
          .catch((error) => reject(error));
      }, wordCountTimeoutMs);
    });
  });
});
