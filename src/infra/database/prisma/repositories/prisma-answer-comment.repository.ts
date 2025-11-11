import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.');
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.');
  }

  async create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
