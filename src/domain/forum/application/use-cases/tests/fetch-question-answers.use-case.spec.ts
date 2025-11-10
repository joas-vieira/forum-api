import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeAnswerFactory } from '../../../../../../test/factories/make-answer.factory.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { FetchQuestionAnswersUseCase } from '../fetch-question-answers.use-case.js';

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: FetchQuestionAnswersUseCase;

describe('FetchQuestionAnswersUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
  });

  it('should be able fetch answers for a question', async () => {
    await inMemoryAnswerRepository.create(
      makeAnswerFactory({
        questionId: new UniqueId('question-1'),
      }),
    );
    await inMemoryAnswerRepository.create(
      makeAnswerFactory({
        questionId: new UniqueId('question-1'),
      }),
    );
    await inMemoryAnswerRepository.create(
      makeAnswerFactory({
        questionId: new UniqueId('question-1'),
      }),
    );

    const response = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(response.value?.answers).toHaveLength(3);
  });

  it('should be able fetch paginated answers for a question', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswerFactory({
          questionId: new UniqueId('question-1'),
        }),
      );
    }

    const response = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(response.value?.answers).toHaveLength(2);
  });
});
