import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';
import { Attachment } from '@prisma/client';

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: Attachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid attachment type');

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueId(raw.id),
        questionId: new UniqueId(raw.questionId),
      },
      new UniqueId(raw.id),
    );
  }
}
