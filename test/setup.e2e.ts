import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const prismaClient = new PrismaClient();

function makeDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  process.env.DATABASE_URL = makeDatabaseUrl(schemaId);

  execSync('bunx prisma migrate deploy');
});

afterAll(async () => {
  await prismaClient.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  );
  await prismaClient.$disconnect();
});
