import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment.entity.js';

import { faker } from '@faker-js/faker';

export function makeAnswerCommentFactory(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueId,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueId(),
      answerId: new UniqueId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answerComment;
}
