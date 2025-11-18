import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.use-case';
import { InvalidCredentialsError } from '@/domain/forum/application/use-cases/errors/invalid-credentials.error';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
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
      switch (response.value.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(response.value.message);
        default:
          throw new BadRequestException(response.value.message);
      }
    }

    return { accessToken: response.value.accessToken };
  }
}
