import type { Notification } from '../../enterprise/entities/notification.entity.js';

export interface NotificationRepository {
  findById: (id: string) => Promise<Notification | null>;
  save: (notification: Notification) => Promise<void>;
  create: (notification: Notification) => Promise<void>;
}
