import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { PrismaService } from '@/infra/prisma/prisma.service';
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
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) { name, email, password }: CreateAccountBody,
  ) {
    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists');
    }

    const hashedPassword = await hash(password, 8);

    await this.prismaService.user.create({
      data: { name, email, password: hashedPassword },
    });
  }
}
