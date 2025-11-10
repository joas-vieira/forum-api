import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeQuestionCommentFactory } from '../../../../../../test/factories/make-question-comment.factory.js';
import { InMemoryQuestionCommentRepository } from '../../../../../../test/repositories/in-memory-question-comment.repository.js';
import { FetchQuestionCommentsUseCase } from '../fetch-question-comments.use-case.js';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentsUseCase;

describe('FetchQuestionCommentsUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository);
  });

  it('should be able fetch question comments', async () => {
    await inMemoryQuestionCommentRepository.create(
      makeQuestionCommentFactory({
        questionId: new UniqueId('question-1'),
      }),
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionCommentFactory({
        questionId: new UniqueId('question-1'),
      }),
    );
    await inMemoryQuestionCommentRepository.create(
      makeQuestionCommentFactory({
        questionId: new UniqueId('question-1'),
      }),
    );

    const response = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(response.value?.questionComments).toHaveLength(3);
  });

  it('should be able fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionCommentFactory({
          questionId: new UniqueId('question-1'),
        }),
      );
    }

    const response = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(response.value?.questionComments).toHaveLength(2);
  });
});
