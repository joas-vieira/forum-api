import { Entity } from '@/core/entities/entity.js';
import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueId) {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}
