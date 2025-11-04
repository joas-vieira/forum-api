import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import z from 'zod';

const authenticateSchema = z.object({
  email: z.email(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof authenticateSchema>;

@Controller('sessions')
export class AuthenticateController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async handle(@Body() { email, password }: AuthenticateBody) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign({ sub: user.id });

    return { accessToken };
  }
}
