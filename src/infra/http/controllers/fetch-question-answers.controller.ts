import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import z from 'zod';
import { AnswerPresenter } from '../presenters/answer.presenter';

const fetchQuestionAnswersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
});

const fetchQuestionAnswersParamsSchema = z.object({
  questionId: z.uuid(),
});

const queryValidationPipe = new ZodValidationPipe(
  fetchQuestionAnswersQuerySchema,
);
const paramsValidationPipe = new ZodValidationPipe(
  fetchQuestionAnswersParamsSchema,
);

type FetchQuestionAnswersQuery = z.infer<
  typeof fetchQuestionAnswersQuerySchema
>;
type FetchQuestionAnswersParams = z.infer<
  typeof fetchQuestionAnswersParamsSchema
>;

@Controller('questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) { page }: FetchQuestionAnswersQuery,
    @Param(paramsValidationPipe) { questionId }: FetchQuestionAnswersParams,
  ) {
    const response = await this.fetchQuestionAnswersUseCase.execute({
      page,
      questionId,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    return {
      answers: response.value.answers.map(AnswerPresenter.toHTTP),
    };
  }
}
