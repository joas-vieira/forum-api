import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
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
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) { page }: FetchRecentQuestionsQuery,
  ) {
    const { value } = await this.fetchRecentQuestionsUseCase.execute({ page });

    if (!value) throw new Error();

    return { questions: value.questions.map(QuestionPresenter.toHTTP) };
  }
}
