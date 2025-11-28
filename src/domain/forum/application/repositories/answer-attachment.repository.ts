import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment.entity.js';

export abstract class AnswerAttachmentRepository {
  abstract findManyByAnswerId: (
    answerId: string,
  ) => Promise<AnswerAttachment[]>;
  abstract deleteManyByAnswerId: (answerId: string) => Promise<void>;
}
