import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment.entity.js';

import { faker } from '@faker-js/faker';

export function makeQuestionCommentFactory(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueId,
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueId(),
      questionId: new UniqueId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return questionComment;
}
