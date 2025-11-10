import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import type { DomainEvent } from '@/core/events/domain-event.js';
import type { AnswerComment } from '../entities/answer-comment.entity.js';

export class AnswerCommentCreatedEvent implements DomainEvent {
  answerComment: AnswerComment;
  occurredAt: Date;

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment;
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueId {
    return this.answerComment.id;
  }
}
