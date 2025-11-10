import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeAnswerCommentFactory } from '../../../../../../test/factories/make-answer-comment.factory.js';
import { InMemoryAnswerCommentRepository } from '../../../../../../test/repositories/in-memory-answer-comment.repository.js';
import { FetchAnswerCommentsUseCase } from '../fetch-answer-comments.use-case.js';

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentsUseCase;

describe('FetchAnswerCommentsUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository);
  });

  it('should be able fetch answer comments', async () => {
    await inMemoryAnswerCommentRepository.create(
      makeAnswerCommentFactory({
        answerId: new UniqueId('answer-1'),
      }),
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerCommentFactory({
        answerId: new UniqueId('answer-1'),
      }),
    );
    await inMemoryAnswerCommentRepository.create(
      makeAnswerCommentFactory({
        answerId: new UniqueId('answer-1'),
      }),
    );

    const response = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    });

    expect(response.value?.answerComments).toHaveLength(3);
  });

  it('should be able fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerCommentFactory({
          answerId: new UniqueId('answer-1'),
        }),
      );
    }

    const response = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    });

    expect(response.value?.answerComments).toHaveLength(2);
  });
});
