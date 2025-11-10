import { right, type Either } from '@/core/either.js';
import { Question } from '../../enterprise/entities/question.entity.js';
import type { QuestionRepository } from '../repositories/question.repository.js';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });

    return right({ questions });
  }
}
