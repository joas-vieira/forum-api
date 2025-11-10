import { left, right, type Either } from '@/core/either.js';
import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { QuestionComment } from '../../enterprise/entities/question-comment.entity.js';
import type { QuestionCommentRepository } from '../repositories/question-comment.repository.js';
import type { QuestionRepository } from '../repositories/question.repository.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';

interface CommentOnQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      questionId: new UniqueId(questionId),
      authorId: new UniqueId(authorId),
      content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({ questionComment });
  }
}
