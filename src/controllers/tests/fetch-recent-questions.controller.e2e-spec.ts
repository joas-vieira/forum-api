import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { authenticate } from 'test/utils/authenticate';

describe('FetchRecentQuestionsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /questions - 200', async () => {
    const { accessToken } = await authenticate({ app });

    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Question 1',
        content: 'Content for question 1',
      });

    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Question 2',
        content: 'Content for question 2',
      });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 2' }),
        expect.objectContaining({ title: 'Question 1' }),
      ],
    });
  });
});
