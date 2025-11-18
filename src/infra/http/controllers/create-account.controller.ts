import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists.error';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema);

type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

@Controller('accounts')
export class CreateAccountController {
  constructor(
    private readonly registerStudentUseCase: RegisterStudentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) { name, email, password }: CreateAccountBody,
  ) {
    const response = await this.registerStudentUseCase.execute({
      name,
      email,
      password,
    });

    if (response.isLeft()) {
      switch (response.value.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(response.value.message);
        default:
          throw new BadRequestException(response.value.message);
      }
    }
  }
}
