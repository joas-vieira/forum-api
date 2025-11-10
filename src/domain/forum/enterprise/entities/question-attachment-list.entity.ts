import { WatchedList } from '@/core/entities/watched-list.js';
import type { QuestionAttachment } from './question-attachment.entity.js';

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId);
  }
}
