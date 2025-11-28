import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer.use-case';
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

const deleteAnswerParamsSchema = z.object({
  id: z.uuid(),
});

const paramsValidationPipe = new ZodValidationPipe(deleteAnswerParamsSchema);

type DeleteAnswerParams = z.infer<typeof deleteAnswerParamsSchema>;

@Controller('answers/:id')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswerUseCase: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param(paramsValidationPipe) { id }: DeleteAnswerParams,
  ) {
    const response = await this.deleteAnswerUseCase.execute({
      answerId: id,
      authorId: user.sub,
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
