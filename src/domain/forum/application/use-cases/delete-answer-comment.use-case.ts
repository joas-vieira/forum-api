import { left, right, type Either } from '@/core/either.js';
import type { AnswerCommentRepository } from '../repositories/answer-comment.repository.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentRepository: AnswerCommentRepository,
  ) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId && answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answerCommentRepository.delete(answerComment);

    return right(null);
  }
}
