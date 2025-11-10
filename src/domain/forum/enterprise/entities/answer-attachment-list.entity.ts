import { WatchedList } from '@/core/entities/watched-list.js';
import type { AnswerAttachment } from './answer-attachment.entity.js';

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId);
  }
}
