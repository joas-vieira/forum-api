import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  Student,
  type StudentProps,
} from '@/domain/forum/enterprise/entities/student.entity.js';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeStudentFactory(
  override: Partial<StudentProps> = {},
  id?: UniqueId,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrisma(override: Partial<StudentProps> = {}) {
    const student = makeStudentFactory(override);

    await this.prismaService.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}
