import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FactoryModule } from '@test/factories/factory.module';
import { AuthFactory } from '@test/factories/make-auth.factory';
import { QuestionFactory } from '@test/factories/make-question.factory';
import request from 'supertest';

describe('DeleteQuestionController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authFactory: AuthFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    authFactory = module.get<AuthFactory>(AuthFactory);
    questionFactory = module.get<QuestionFactory>(QuestionFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[DELETE] /questions/:id - 204', async () => {
    const { accessToken, user } = await authFactory.makeToken();

    const question = await questionFactory.makePrisma({ authorId: user.id });

    await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204);

    const questionOnDatabase = await prismaService.question.findUnique({
      where: { id: question.id.toString() },
    });

    expect(questionOnDatabase).toBeFalsy();
  });
});
