import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment.repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment.mapper';

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prismaService.comment.findUnique({
      where: { id },
    });

    if (!questionComment) return null;

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prismaService.comment.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prismaService.comment.create({ data });
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: { id: questionComment.id.toString() },
    });
  }
}
