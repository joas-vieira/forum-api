import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  Answer,
  type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer.entity.js';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAnswerFactory(
  override: Partial<AnswerProps> = {},
  id?: UniqueId,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueId(),
      questionId: new UniqueId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}

@Injectable()
export class AnswerFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrisma(override: Partial<AnswerProps> = {}) {
    const answer = makeAnswerFactory(override);

    await this.prismaService.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
