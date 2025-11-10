import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { Question } from '../../enterprise/entities/question.entity.js';

export interface QuestionRepository {
  findById: (id: string) => Promise<Question | null>;
  findBySlug: (slug: string) => Promise<Question | null>;
  findManyRecent: (params: PaginationParams) => Promise<Question[]>;
  save: (question: Question) => Promise<void>;
  create: (question: Question) => Promise<void>;
  delete: (question: Question) => Promise<void>;
}
