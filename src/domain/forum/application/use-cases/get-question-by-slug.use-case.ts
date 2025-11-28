import { left, right, type Either } from '@/core/either.js';
import { Question } from '../../enterprise/entities/question.entity.js';
import { QuestionRepository } from '../repositories/question.repository.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';
import { Injectable } from '@nestjs/common';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
