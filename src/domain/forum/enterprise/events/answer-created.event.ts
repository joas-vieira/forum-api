import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import type { DomainEvent } from '@/core/events/domain-event.js';
import type { Answer } from '../entities/answer.entity.js';

export class AnswerCreatedEvent implements DomainEvent {
  answer: Answer;
  occurredAt: Date;

  constructor(answer: Answer) {
    this.answer = answer;
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueId {
    return this.answer.id;
  }
}
