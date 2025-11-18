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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
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
  ],
})
export class HttpModule {}
