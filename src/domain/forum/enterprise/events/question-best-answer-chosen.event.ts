import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import type { DomainEvent } from '@/core/events/domain-event.js';
import type { Question } from '../entities/question.entity.js';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  question: Question;
  bestAnswerId: UniqueId;
  occurredAt: Date;

  constructor(question: Question, bestAnswerId: UniqueId) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueId {
    return this.question.id;
  }
}
