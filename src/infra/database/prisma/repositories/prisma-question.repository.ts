import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionRepository } from '@/domain/forum/application/repositories/question.repository';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: { slug },
    });

    if (!question) return null;

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prismaService.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prismaService.question.update({
      where: { id: data.id },
      data,
    });
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prismaService.question.create({ data });
  }

  async delete(question: Question): Promise<void> {
    await this.prismaService.question.delete({
      where: { id: question.id.toString() },
    });
  }
}
