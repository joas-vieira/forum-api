import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';
import { Comment, Prisma } from '@prisma/client';

export class PrismaQuestionCommentMapper {
  static toDomain(raw: Comment): QuestionComment {
    if (!raw.questionId) throw new Error('Invalid comment type');

    return QuestionComment.create(
      {
        authorId: new UniqueId(raw.authorId),
        questionId: new UniqueId(raw.questionId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueId(raw.id),
    );
  }

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    };
  }
}
