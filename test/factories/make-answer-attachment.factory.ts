import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  AnswerAttachment,
  type AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment.entity.js';

export function makeAnswerAttachmentFactory(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueId,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueId(),
      attachmentId: new UniqueId(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}
