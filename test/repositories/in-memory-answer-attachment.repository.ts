import type { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment.repository.js';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity.js';

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    );

    return answerAttachments;
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    );
  }
}
