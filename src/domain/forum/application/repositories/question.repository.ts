import type { Question } from "../../enterprise/entities/question.entity.js";

export interface QuestionRepository {
  findBySlug: (slug: string) => Promise<Question | null>;
  create: (question: Question) => Promise<void>;
}
