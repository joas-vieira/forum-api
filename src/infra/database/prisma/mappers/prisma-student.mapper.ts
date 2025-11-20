import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object';
import { Student } from '@/domain/forum/enterprise/entities/student.entity';
import { Prisma, User } from '@prisma/client';

export class PrismaStudentMapper {
  static toDomain(raw: User): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueId(raw.id),
    );
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    };
  }
}
