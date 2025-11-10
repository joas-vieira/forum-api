import { right, type Either } from '@/core/either.js';
import type { QuestionComment } from '../../enterprise/entities/question-comment.entity.js';
import type { QuestionCommentRepository } from '../repositories/question-comment.repository.js';

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class FetchQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({ questionComments });
  }
}
