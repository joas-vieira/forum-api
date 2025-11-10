import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  Notification,
  type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification.entity.js';
import { faker } from '@faker-js/faker';

export function makeNotificationFactory(
  override: Partial<NotificationProps> = {},
  id?: UniqueId,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return notification;
}
