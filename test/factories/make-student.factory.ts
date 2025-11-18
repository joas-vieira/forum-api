import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  Student,
  type StudentProps,
} from '@/domain/forum/enterprise/entities/student.entity.js';
import { faker } from '@faker-js/faker';

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
