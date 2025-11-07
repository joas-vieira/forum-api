import { INestApplication } from '@nestjs/common';
import request from 'supertest';

interface AuthenticateRequest {
  app: INestApplication;
}

interface AuthenticateResponse {
  accessToken: string;
}

export async function authenticate({
  app,
}: AuthenticateRequest): Promise<AuthenticateResponse> {
  await request(app.getHttpServer()).post('/accounts').send({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '123456',
  });

  const response = await request(app.getHttpServer()).post('/sessions').send({
    email: 'john.doe@example.com',
    password: '123456',
  });

  return {
    accessToken: response.body.accessToken,
  };
}
