import { Module } from '@nestjs/common';
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachment.repository';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comment.repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer.repository';
import { PrismaQuestionAttachmentRepository } from './prisma/repositories/prisma-question-attachment.repository';
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comment.repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question.repository';
import { PrismaService } from './prisma/prisma.service';
import { QuestionRepository } from '@/domain/forum/application/repositories/question.repository';
import { StudentRepository } from '@/domain/forum/application/repositories/student.repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student.repository';
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment.repository';
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment.repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer.repository';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment.repository';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentRepository,
    },
    { provide: AnswerRepository, useClass: PrismaAnswerRepository },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentRepository,
    },
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
  ],
  exports: [
    PrismaService,
    AnswerAttachmentRepository,
    AnswerCommentRepository,
    AnswerRepository,
    QuestionAttachmentRepository,
    QuestionCommentRepository,
    QuestionRepository,
    StudentRepository,
  ],
})
export class DatabaseModule {}
