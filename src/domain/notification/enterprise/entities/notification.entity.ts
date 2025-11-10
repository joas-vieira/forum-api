import { Entity } from '@/core/entities/entity.js';
import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import type { Optional } from '@/core/types/optional.js';

export interface NotificationProps {
  recipientId: UniqueId;
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  read() {
    this.props.readAt = new Date();
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueId,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }
}
