import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prismaService.comment.findUnique({
      where: { id },
    });

    if (!answerComment) return null;

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prismaService.comment.findMany({
      where: { answerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prismaService.comment.create({ data });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: { id: answerComment.id.toString() },
    });
  }
}
