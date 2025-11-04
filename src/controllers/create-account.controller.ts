import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import z from 'zod';

const createAccountSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateAccountBody = z.infer<typeof createAccountSchema>;

@Controller('accounts')
export class CreateAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  @HttpCode(201)
  async handle(@Body() { name, email, password }: CreateAccountBody) {
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
