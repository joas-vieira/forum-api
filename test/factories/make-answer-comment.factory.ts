import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment.entity.js';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeAnswerCommentFactory(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueId,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueId(),
      answerId: new UniqueId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrisma(override: Partial<AnswerCommentProps> = {}) {
    const answerComment = makeAnswerCommentFactory(override);

    await this.prismaService.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    });

    return answerComment;
  }
}
