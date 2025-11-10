import { DomainEvents } from '@/core/events/domain-events.js';
import type { PaginationParams } from '@/core/repositories/pagination-params.js';
import type { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment.repository.js';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity.js';

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  items: AnswerComment[] = [];

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) return null;

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );

    this.items.splice(itemIndex, 1);
  }
}
