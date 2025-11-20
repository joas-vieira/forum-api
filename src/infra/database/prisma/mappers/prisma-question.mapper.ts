import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { Prisma, Question as PrismaQuestion } from '@prisma/client';

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueId(raw.authorId),
        bestAnswerId: raw.bestAnswerId ? new UniqueId(raw.bestAnswerId) : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueId(raw.id),
    );
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
