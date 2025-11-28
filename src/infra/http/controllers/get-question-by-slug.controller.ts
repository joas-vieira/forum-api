import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common';
import z from 'zod';
import { QuestionPresenter } from '../presenters/question.presenter';

const getQuestionBySlugParamSchema = z.object({
  slug: z.string(),
});

const queryValidationPipe = new ZodValidationPipe(getQuestionBySlugParamSchema);

type GetQuestionBySlugParams = z.infer<typeof getQuestionBySlugParamSchema>;

@Controller('questions/:slug')
export class GetQuestionBySlugController {
  constructor(
    private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Param(queryValidationPipe) { slug }: GetQuestionBySlugParams) {
    const response = await this.getQuestionBySlugUseCase.execute({ slug });

    if (response.isLeft()) {
      throw new BadRequestException();
    }

    return {
      question: QuestionPresenter.toHTTP(response.value.question),
    };
  }
}
