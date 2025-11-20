import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import { Attachment } from '@prisma/client';

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: Attachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid attachment type');

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueId(raw.id),
        answerId: new UniqueId(raw.answerId),
      },
      new UniqueId(raw.id),
    );
  }
}
