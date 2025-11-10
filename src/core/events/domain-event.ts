import type { UniqueId } from '../entities/value-objects/unique-id.value-object.js';

export interface DomainEvent {
  occurredAt: Date;
  getAggregateId(): UniqueId;
}
