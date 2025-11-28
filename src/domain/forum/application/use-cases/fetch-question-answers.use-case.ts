import { right, type Either } from '@/core/either.js';
import type { Answer } from '../../enterprise/entities/answer.entity.js';
import { AnswerRepository } from '../repositories/answer.repository.js';
import { Injectable } from '@nestjs/common';

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return right({ answers });
  }
}
