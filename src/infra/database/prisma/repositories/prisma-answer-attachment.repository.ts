import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment.repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prismaService.attachment.findMany({
      where: { answerId },
    });

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: { answerId },
    });
  }
}
