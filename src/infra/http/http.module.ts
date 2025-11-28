import { Module } from '@nestjs/common';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.use-case';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.use-case';
import { QuestionRepository } from '@/domain/forum/application/repositories/question.repository';
import { StudentRepository } from '@/domain/forum/application/repositories/student.repository';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { makeUseCaseProvider } from './factories/make-use-case-provider.factory';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.use-case';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.use-case';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment.repository';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question.use-case';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question.use-case';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer.repository';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
  ],
  providers: [
    makeUseCaseProvider(RegisterStudentUseCase, [
      StudentRepository,
      HashGenerator,
    ]),
    makeUseCaseProvider(AuthenticateStudentUseCase, [
      StudentRepository,
      HashComparer,
      Encrypter,
    ]),
    makeUseCaseProvider(CreateQuestionUseCase, [QuestionRepository]),
    makeUseCaseProvider(FetchRecentQuestionsUseCase, [QuestionRepository]),
    makeUseCaseProvider(GetQuestionBySlugUseCase, [QuestionRepository]),
    makeUseCaseProvider(EditQuestionUseCase, [
      QuestionRepository,
      QuestionAttachmentRepository,
    ]),
    makeUseCaseProvider(DeleteQuestionUseCase, [QuestionRepository]),
    makeUseCaseProvider(AnswerQuestionUseCase, [AnswerRepository]),
  ],
})
export class HttpModule {}
