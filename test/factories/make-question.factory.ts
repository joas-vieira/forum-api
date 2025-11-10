import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question.entity.js';
import { faker } from '@faker-js/faker';

export function makeQuestionFactory(
  override: Partial<QuestionProps> = {},
  id?: UniqueId,
) {
  const question = Question.create(
    {
      authorId: new UniqueId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}
