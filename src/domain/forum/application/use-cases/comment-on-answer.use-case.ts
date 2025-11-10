import { left, right, type Either } from '@/core/either.js';
import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { AnswerComment } from '../../enterprise/entities/answer-comment.entity.js';
import type { AnswerCommentRepository } from '../repositories/answer-comment.repository.js';
import type { AnswerRepository } from '../repositories/answer.repository.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';

interface CommentOnAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly answerCommentRepository: AnswerCommentRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      answerId: new UniqueId(answerId),
      authorId: new UniqueId(authorId),
      content,
    });

    await this.answerCommentRepository.create(answerComment);

    return right({ answerComment });
  }
}
