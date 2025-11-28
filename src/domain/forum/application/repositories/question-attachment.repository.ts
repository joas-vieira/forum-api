import type { QuestionAttachment } from '../../enterprise/entities/question-attachment.entity.js';

export abstract class QuestionAttachmentRepository {
  abstract findManyByQuestionId: (
    questionId: string,
  ) => Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId: (questionId: string) => Promise<void>;
}
