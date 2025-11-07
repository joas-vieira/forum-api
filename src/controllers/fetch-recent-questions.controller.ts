import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import z from 'zod';

const fetchRecentQuestionsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
});

const queryValidationPipe = new ZodValidationPipe(
  fetchRecentQuestionsQuerySchema,
);

type FetchRecentQuestionsQuery = z.infer<
  typeof fetchRecentQuestionsQuerySchema
>;

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) { page }: FetchRecentQuestionsQuery,
  ) {
    const perPage = 20;

    const questions = await this.prismaService.question.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return { questions };
  }
}
