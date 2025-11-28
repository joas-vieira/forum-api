import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question.use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { TokenPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import z from 'zod';

const answerQuestionBodySchema = z.object({
  content: z.string(),
});

const answerQuestionParamsSchema = z.object({
  questionId: z.uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);
const paramsValidationPipe = new ZodValidationPipe(answerQuestionParamsSchema);

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>;
type AnswerQuestionParams = z.infer<typeof answerQuestionParamsSchema>;

@Controller('questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body(bodyValidationPipe) { content }: AnswerQuestionBody,
    @Param(paramsValidationPipe) { questionId }: AnswerQuestionParams,
  ) {
    const response = await this.answerQuestionUseCase.execute({
      authorId: user.sub,
      questionId,
      content,
      attachmentsIds: [],
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
