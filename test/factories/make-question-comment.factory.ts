import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment.entity.js';
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeQuestionCommentFactory(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueId,
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueId(),
      questionId: new UniqueId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrisma(override: Partial<QuestionCommentProps> = {}) {
    const questionComment = makeQuestionCommentFactory(override);

    await this.prismaService.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    });

    return questionComment;
  }
}
