import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { Answer } from '../../enterprise/entities/answer.entity.js';

export abstract class AnswerRepository {
  abstract findById: (id: string) => Promise<Answer | null>;
  abstract findManyByQuestionId: (
    questionId: string,
    params: PaginationParams,
  ) => Promise<Answer[]>;
  abstract save: (answer: Answer) => Promise<void>;
  abstract create: (answer: Answer) => Promise<void>;
  abstract delete: (answer: Answer) => Promise<void>;
}
