import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.use-case';
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

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const editQuestionParamsSchema = z.object({
  id: z.uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);
const paramsValidationPipe = new ZodValidationPipe(editQuestionParamsSchema);

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>;
type EditQuestionParams = z.infer<typeof editQuestionParamsSchema>;

@Controller('questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestionUseCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body(bodyValidationPipe) { title, content }: EditQuestionBody,
    @Param(paramsValidationPipe) { id }: EditQuestionParams,
  ) {
    const response = await this.editQuestionUseCase.execute({
      questionId: id,
      authorId: user.sub,
      title,
      content,
      attachmentsIds: [],
    });

    if (response.isLeft()) {
      throw new BadRequestException();
    }
  }
}
