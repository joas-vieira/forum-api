import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { QuestionRepository } from '@/domain/forum/application/repositories/question.repository';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.use-case';
import { StudentRepository } from '@/domain/forum/application/repositories/student.repository';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.use-case';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    {
      provide: RegisterStudentUseCase,
      useFactory: (
        studentRepository: StudentRepository,
        hashGenerator: HashGenerator,
      ) => {
        return new RegisterStudentUseCase(studentRepository, hashGenerator);
      },
      inject: [StudentRepository, HashGenerator],
    },
    {
      provide: AuthenticateStudentUseCase,
      useFactory: (
        studentRepository: StudentRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
      ) => {
        return new AuthenticateStudentUseCase(
          studentRepository,
          hashComparer,
          encrypter,
        );
      },
      inject: [StudentRepository, HashComparer, Encrypter],
    },
    {
      provide: CreateQuestionUseCase,
      useFactory: (questionRepository: QuestionRepository) => {
        return new CreateQuestionUseCase(questionRepository);
      },
      inject: [QuestionRepository],
    },
    {
      provide: FetchRecentQuestionsUseCase,
      useFactory: (questionRepository: QuestionRepository) => {
        return new FetchRecentQuestionsUseCase(questionRepository);
      },
      inject: [QuestionRepository],
    },
  ],
})
export class HttpModule {}
