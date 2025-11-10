import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { AnswerComment } from '../../enterprise/entities/answer-comment.entity.js';

export interface AnswerCommentRepository {
  findById: (id: string) => Promise<AnswerComment | null>;
  findManyByAnswerId: (
    answerId: string,
    params: PaginationParams,
  ) => Promise<AnswerComment[]>;
  create: (answerComment: AnswerComment) => Promise<void>;
  delete: (answerComment: AnswerComment) => Promise<void>;
}
