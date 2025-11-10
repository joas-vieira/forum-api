import type { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import type { Optional } from '@/core/types/optional.js';
import { Comment, type CommentProps } from './comment.entity.js';

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId;
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return questionComment;
  }
}
