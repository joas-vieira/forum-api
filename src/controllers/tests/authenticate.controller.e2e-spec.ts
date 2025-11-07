import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('AuthenticateController', () => {
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

  test('[POST] /sessions - 201', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
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
