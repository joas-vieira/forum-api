import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment.repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.');
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.');
  }

  async create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
