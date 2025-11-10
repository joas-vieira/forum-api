import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  QuestionAttachment,
  type QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment.entity.js';

export function makeQuestionAttachmentFactory(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueId,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueId(),
      attachmentId: new UniqueId(),
      ...override,
    },
    id,
  );

  return questionAttachment;
}
