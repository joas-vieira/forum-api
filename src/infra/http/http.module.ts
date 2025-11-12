import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { QuestionRepository } from '@/domain/forum/application/repositories/question.repository';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
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
