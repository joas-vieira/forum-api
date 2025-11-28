import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FactoryModule } from '@test/factories/factory.module';
import { AuthFactory } from '@test/factories/make-auth.factory';
import { QuestionFactory } from '@test/factories/make-question.factory';
import request from 'supertest';

describe('GetQuestionBySlugController', () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let authFactory: AuthFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    }).compile();

    app = module.createNestApplication();
    questionFactory = module.get<QuestionFactory>(QuestionFactory);
    authFactory = module.get<AuthFactory>(AuthFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /questions/:slug - 200', async () => {
    const { accessToken, user } = await authFactory.makeToken();

    await questionFactory.makePrisma({
      authorId: user.id,
      title: 'Question 1',
    });

    const response = await request(app.getHttpServer())
      .get('/questions/question-1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 1' }),
    });
  });
});
