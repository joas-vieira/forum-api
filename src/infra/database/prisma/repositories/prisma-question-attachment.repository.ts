import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment.repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.');
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
