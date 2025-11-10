import type { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment.repository.js';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity.js';

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );
  }
}
