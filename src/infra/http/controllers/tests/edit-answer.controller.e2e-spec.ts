import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FactoryModule } from '@test/factories/factory.module';
import { AnswerFactory } from '@test/factories/make-answer.factory';
import { AuthFactory } from '@test/factories/make-auth.factory';
import { QuestionFactory } from '@test/factories/make-question.factory';
import request from 'supertest';

describe('EditAnswerController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authFactory: AuthFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    authFactory = module.get<AuthFactory>(AuthFactory);
    questionFactory = module.get<QuestionFactory>(QuestionFactory);
    answerFactory = module.get<AnswerFactory>(AnswerFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[PUT] /questions/:id - 204', async () => {
    const { accessToken, user } = await authFactory.makeToken();

    const question = await questionFactory.makePrisma({ authorId: user.id });
    const answer = await answerFactory.makePrisma({
      authorId: user.id,
      questionId: question.id,
    });

    await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Updated answer content',
      })
      .expect(204);

    const answerOnDatabase = await prismaService.answer.findFirst({
      where: { content: 'Updated answer content' },
    });

    expect(answerOnDatabase).toBeTruthy();
  });
});
