import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question.use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { TokenPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import z from 'zod';

const deleteQuestionParamsSchema = z.object({
  id: z.uuid(),
});

const paramsValidationPipe = new ZodValidationPipe(deleteQuestionParamsSchema);

type DeleteQuestionParams = z.infer<typeof deleteQuestionParamsSchema>;

@Controller('questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param(paramsValidationPipe) { id }: DeleteQuestionParams,
  ) {
    const response = await this.deleteQuestionUseCase.execute({
      questionId: id,
      authorId: user.sub,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
