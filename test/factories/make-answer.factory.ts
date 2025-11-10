import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  Answer,
  type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer.entity.js';
import { faker } from '@faker-js/faker';

export function makeAnswerFactory(
  override: Partial<AnswerProps> = {},
  id?: UniqueId,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueId(),
      questionId: new UniqueId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}
