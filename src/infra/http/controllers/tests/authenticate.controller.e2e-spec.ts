import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FactoryModule } from '@test/factories/factory.module';
import { StudentFactory } from '@test/factories/make-student.factory';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('AuthenticateController', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    }).compile();

    app = module.createNestApplication();
    studentFactory = module.get<StudentFactory>(StudentFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /sessions - 201', async () => {
    await studentFactory.makePrisma({
      email: 'john.doe@example.com',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'john.doe@example.com',
        password: '123456',
      })
      .expect(201);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });
});
