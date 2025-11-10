import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment.entity.js';

export interface AnswerAttachmentRepository {
  findManyByAnswerId: (answerId: string) => Promise<AnswerAttachment[]>;
  deleteManyByAnswerId: (answerId: string) => Promise<void>;
}
