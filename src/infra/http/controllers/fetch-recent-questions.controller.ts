import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common';
import z from 'zod';
import { QuestionPresenter } from '../presenters/question.presenter';

const fetchRecentQuestionsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
});

const queryValidationPipe = new ZodValidationPipe(
  fetchRecentQuestionsQuerySchema,
);

type FetchRecentQuestionsQuery = z.infer<
  typeof fetchRecentQuestionsQuerySchema
>;

@Controller('questions')
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) { page }: FetchRecentQuestionsQuery,
  ) {
    const response = await this.fetchRecentQuestionsUseCase.execute({ page });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    return {
      questions: response.value.questions.map(QuestionPresenter.toHTTP),
    };
  }
}
