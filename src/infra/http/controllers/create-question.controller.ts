import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import type { TokenPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import z from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Body(bodyValidationPipe) { title, content }: CreateQuestionBody,
  ) {
    const response = await this.createQuestionUseCase.execute({
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
