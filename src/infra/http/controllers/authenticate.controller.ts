import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema);

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

@Controller('sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateStudentUseCase: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) { email, password }: AuthenticateBody,
  ) {
    const response = await this.authenticateStudentUseCase.execute({
      email,
      password,
    });

    if (response.isLeft()) {
      throw new Error();
    }

    return { accessToken: response.value.accessToken };
  }
}
