import { InMemoryNotificationRepository } from '../../../../../../test/repositories/in-memory-notification.repository.js';
import { SendNotificationUseCase } from '../send-notification.use-case.js';

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;

describe('SendNotificationUseCase', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it('should be able create a notification', async () => {
    const response = await sut.execute({
      recipientId: '1',
      title: 'This is a notification',
      content: 'This is the content of the notification',
    });

    expect(response.isRight()).toBe(true);
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      response.value?.notification,
    );
  });
});
