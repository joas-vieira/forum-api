import { DomainEvents } from '@/core/events/domain-events.js';
import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment.repository.js';
import type { QuestionRepository } from '@/domain/forum/application/repositories/question.repository.js';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity.js';

export class InMemoryQuestionRepository implements QuestionRepository {
  items: Question[] = [];

  constructor(
    private readonly questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) return null;

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    await this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }
}
