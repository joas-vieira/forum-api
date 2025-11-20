import { StudentRepository } from '@/domain/forum/application/repositories/student.repository';
import { Student } from '@/domain/forum/enterprise/entities/student.entity';
import { Injectable } from '@nestjs/common';
import { PrismaStudentMapper } from '../mappers/prisma-student.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaStudentRepository implements StudentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!student) return null;

    return PrismaStudentMapper.toDomain(student);
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student);

    await this.prismaService.user.create({ data });
  }
}
