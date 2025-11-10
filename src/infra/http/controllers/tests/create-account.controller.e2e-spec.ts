import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('CreateAccountController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    prismaService = app.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /accounts - 201', async () => {
    await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      })
      .expect(201);

    const user = await prismaService.user.findUnique({
      where: { email: 'john.doe@example.com' },
    });

    expect(user).toBeTruthy();
  });
});
