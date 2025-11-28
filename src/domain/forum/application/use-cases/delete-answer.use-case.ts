import { left, right, type Either } from '@/core/either.js';
import { AnswerRepository } from '../repositories/answer.repository.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId && answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answerRepository.delete(answer);

    return right(null);
  }
}
