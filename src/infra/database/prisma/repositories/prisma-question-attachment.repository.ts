import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment.repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prismaService.attachment.findMany({
      where: { questionId },
    });

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: { questionId },
    });
  }
}
