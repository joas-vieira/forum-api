import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FactoryModule } from '@test/factories/factory.module';
import { AnswerFactory } from '@test/factories/make-answer.factory';
import { AuthFactory } from '@test/factories/make-auth.factory';
import { QuestionFactory } from '@test/factories/make-question.factory';
import request from 'supertest';

describe('FetchQuestionAnswersController', () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let authFactory: AuthFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    }).compile();

    app = module.createNestApplication();
    questionFactory = module.get<QuestionFactory>(QuestionFactory);
    answerFactory = module.get<AnswerFactory>(AnswerFactory);
    authFactory = module.get<AuthFactory>(AuthFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /questions/:questionId/answers - 200', async () => {
    const { accessToken, user } = await authFactory.makeToken();

    const question = await questionFactory.makePrisma({
      authorId: user.id,
      title: 'Question 1',
    });

    await answerFactory.makePrisma({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer 1',
    });

    await answerFactory.makePrisma({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer 2',
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      answers: [
        expect.objectContaining({ content: 'Answer 2' }),
        expect.objectContaining({ content: 'Answer 1' }),
      ],
    });
  });
});
