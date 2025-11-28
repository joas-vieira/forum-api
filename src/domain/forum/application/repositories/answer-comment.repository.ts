import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { AnswerComment } from '../../enterprise/entities/answer-comment.entity.js';

export abstract class AnswerCommentRepository {
  abstract findById: (id: string) => Promise<AnswerComment | null>;
  abstract findManyByAnswerId: (
    answerId: string,
    params: PaginationParams,
  ) => Promise<AnswerComment[]>;
  abstract create: (answerComment: AnswerComment) => Promise<void>;
  abstract delete: (answerComment: AnswerComment) => Promise<void>;
}
