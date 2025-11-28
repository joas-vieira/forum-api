import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer.use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { TokenPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import z from 'zod';

const editAnswerBodySchema = z.object({
  content: z.string(),
});

const editAnswerParamsSchema = z.object({
  id: z.uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);
const paramsValidationPipe = new ZodValidationPipe(editAnswerParamsSchema);

type EditAnswerBody = z.infer<typeof editAnswerBodySchema>;
type EditAnswerParams = z.infer<typeof editAnswerParamsSchema>;

@Controller('answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswerUseCase: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body(bodyValidationPipe) { content }: EditAnswerBody,
    @Param(paramsValidationPipe) { id }: EditAnswerParams,
  ) {
    const response = await this.editAnswerUseCase.execute({
      answerId: id,
      authorId: user.sub,
      content,
      attachmentsIds: [],
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
