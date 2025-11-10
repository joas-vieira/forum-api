import { left, right, type Either } from '@/core/either.js';
import type { Question } from '../../enterprise/entities/question.entity.js';
import type { AnswerRepository } from '../repositories/answer.repository.js';
import type { QuestionRepository } from '../repositories/question.repository.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId && question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
