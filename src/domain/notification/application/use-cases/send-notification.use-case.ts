import { right, type Either } from '@/core/either.js';
import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { Notification } from '../../enterprise/entities/notification.entity.js';
import type { NotificationRepository } from '../repositories/notification.repository.js';

interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueId(recipientId),
      title,
      content,
    });

    await this.notificationRepository.create(notification);

    return right({ notification });
  }
}
