import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FactoryModule } from '@test/factories/factory.module';
import { AuthFactory } from '@test/factories/make-auth.factory';
import request from 'supertest';

describe('CreateQuestionController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authFactory: AuthFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    authFactory = module.get<AuthFactory>(AuthFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /questions - 201', async () => {
    const { accessToken } = await authFactory.makeToken();

    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Question content',
      })
      .expect(201);

    const question = await prismaService.question.findFirst({
      where: { title: 'New Question' },
    });

    expect(question).toBeTruthy();
  });
});
