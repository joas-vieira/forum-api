import type { QuestionAttachment } from '../../enterprise/entities/question-attachment.entity.js';

export interface QuestionAttachmentRepository {
  findManyByQuestionId: (questionId: string) => Promise<QuestionAttachment[]>;
  deleteManyByQuestionId: (questionId: string) => Promise<void>;
}
