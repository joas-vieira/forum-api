import { Entity } from '@/core/entities/entity.js';
import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueId) {
    const student = new Student(props, id);

    return student;
  }
}
