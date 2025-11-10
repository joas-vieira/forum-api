import { left, right, type Either } from '@/core/either.js';
import type { QuestionCommentRepository } from '../repositories/question-comment.repository.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId && questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentRepository.delete(questionComment);

    return right(null);
  }
}
