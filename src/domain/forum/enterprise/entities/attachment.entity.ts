import { AggregateRoot } from '@/core/entities/aggregate-root.js';
import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';

export interface AttachmentProps {
  title: string;
  link: string;
}

export class Attachment extends AggregateRoot<AttachmentProps> {
  get title() {
    return this.props.title;
  }

  get link() {
    return this.props.link;
  }

  static create(props: AttachmentProps, id?: UniqueId) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
