import { left, right, type Either } from '@/core/either.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';
import type { NotificationRepository } from '../repositories/notification.repository.js';
import type { Notification } from '../../enterprise/entities/notification.entity.js';

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>;

export class ReadNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId && notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationRepository.save(notification);

    return right({ notification });
  }
}
