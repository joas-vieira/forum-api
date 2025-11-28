import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FactoryModule } from '@test/factories/factory.module';
import { AnswerFactory } from '@test/factories/make-answer.factory';
import { AuthFactory } from '@test/factories/make-auth.factory';
import { QuestionFactory } from '@test/factories/make-question.factory';
import request from 'supertest';

describe('DeleteAnswerController', () => {
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

  test('[DELETE] /answers/:id - 204', async () => {
    const { accessToken, user } = await authFactory.makeToken();

    const question = await questionFactory.makePrisma({ authorId: user.id });
    const answer = await answerFactory.makePrisma({
      authorId: user.id,
      questionId: question.id,
    });

    await request(app.getHttpServer())
      .delete(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204);

    const answerOnDatabase = await prismaService.answer.findUnique({
      where: { id: answer.id.toString() },
    });

    expect(answerOnDatabase).toBeFalsy();
  });
});
