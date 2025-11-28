import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { QuestionFactory } from './make-question.factory';
import { StudentFactory } from './make-student.factory';
import { AuthFactory } from './make-auth.factory';
import { AnswerFactory } from './make-answer.factory';
import { AnswerCommentFactory } from './make-answer-comment.factory';
import { QuestionCommentFactory } from './make-question-comment.factory';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthFactory,
    StudentFactory,
    QuestionFactory,
    AnswerFactory,
    QuestionCommentFactory,
    AnswerCommentFactory,
  ],
  exports: [
    AuthFactory,
    StudentFactory,
    QuestionFactory,
    AnswerFactory,
    QuestionCommentFactory,
    AnswerCommentFactory,
  ],
})
export class FactoryModule {}
