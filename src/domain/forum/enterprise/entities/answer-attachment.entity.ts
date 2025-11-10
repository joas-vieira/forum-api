import { Entity } from '@/core/entities/entity.js';
import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';

export interface AnswerAttachmentProps {
  answerId: UniqueId;
  attachmentId: UniqueId;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: AnswerAttachmentProps, id?: UniqueId) {
    const answerAttachment = new AnswerAttachment(props, id);

    return answerAttachment;
  }
}
