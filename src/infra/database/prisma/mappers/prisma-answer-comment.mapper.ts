import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { Comment, Prisma } from '@prisma/client';

export class PrismaAnswerCommentMapper {
  static toDomain(raw: Comment): AnswerComment {
    if (!raw.answerId) throw new Error('Invalid comment type');

    return AnswerComment.create(
      {
        authorId: new UniqueId(raw.authorId),
        answerId: new UniqueId(raw.answerId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueId(raw.id),
    );
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    };
  }
}
