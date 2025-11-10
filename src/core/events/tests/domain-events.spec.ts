import { AggregateRoot } from '@/core/entities/aggregate-root.js';
import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { vi } from 'vitest';
import type { DomainEvent } from '../domain-event.js';
import { DomainEvents } from '../domain-events.js';

class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.occurredAt = new Date();
  }

  public getAggregateId(): UniqueId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn();

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Estou criando uma resposta porém SEM salvar no banco
    const aggregate = CustomAggregate.create();

    // Estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1);

    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled();

    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
