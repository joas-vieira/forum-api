import { DomainEvents } from '@/core/events/domain-events.js';
import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment.repository.js';
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer.repository.js';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity.js';

export class InMemoryAnswerRepository implements AnswerRepository {
  items: Answer[] = [];

  constructor(
    private readonly answerAttachmentRepository: AnswerAttachmentRepository,
  ) {}

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) return null;

    return answer;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);

    await this.answerAttachmentRepository.deleteManyByAnswerId(
      answer.id.toString(),
    );
  }
}
