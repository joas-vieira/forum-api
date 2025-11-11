import { Module } from '@nestjs/common';
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachment.repository';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment.repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer.repository';
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment.repository';
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment.repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question.repository';
import { PrismaService } from './prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerRepository,
    PrismaQuestionAttachmentRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerRepository,
    PrismaQuestionAttachmentRepository,
    PrismaQuestionCommentRepository,
    PrismaQuestionRepository,
  ],
})
export class DatabaseModule {}
