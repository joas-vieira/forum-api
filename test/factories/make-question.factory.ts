import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question.entity.js';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeQuestionFactory(
  override: Partial<QuestionProps> = {},
  id?: UniqueId,
) {
  const question = Question.create(
    {
      authorId: new UniqueId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrisma(override: Partial<QuestionProps> = {}) {
    const question = makeQuestionFactory(override);

    await this.prismaService.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
