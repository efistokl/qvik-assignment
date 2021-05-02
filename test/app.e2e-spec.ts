import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Channel CRUD', async () => {
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
    console.log(id);
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

  afterAll(async () => {
    await app.close();
  });
});
