import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { makeNotificationFactory } from '../../../../../../test/factories/make-notification.factory.js';
import { InMemoryNotificationRepository } from '../../../../../../test/repositories/in-memory-notification.repository.js';
import { ReadNotificationUseCase } from '../read-notification.use-case.js';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe('ReadNotificationUseCase', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotificationFactory();

    await inMemoryNotificationRepository.create(notification);

    await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(inMemoryNotificationRepository.items[0]?.readAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to read a notification from another recipient', async () => {
    const notification = makeNotificationFactory({
      recipientId: new UniqueId('author-1'),
    });

    await inMemoryNotificationRepository.create(notification);

    const response = await sut.execute({
      recipientId: 'author-2',
      notificationId: notification.id.toString(),
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
