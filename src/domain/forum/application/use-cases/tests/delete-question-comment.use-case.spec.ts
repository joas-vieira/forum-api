import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeQuestionCommentFactory } from '../../../../../../test/factories/make-question-comment.factory.js';
import { InMemoryQuestionCommentRepository } from '../../../../../../test/repositories/in-memory-question-comment.repository.js';
import { DeleteQuestionCommentUseCase } from '../delete-question-comment.use-case.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: DeleteQuestionCommentUseCase;

describe('DeleteQuestionCommentUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository);
  });

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionCommentFactory();

    await inMemoryQuestionCommentRepository.create(newQuestionComment);

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question comment from another author', async () => {
    const newQuestionComment = makeQuestionCommentFactory({
      authorId: new UniqueId('author-1'),
    });

    await inMemoryQuestionCommentRepository.create(newQuestionComment);

    const response = await sut.execute({
      authorId: 'author-2',
      questionCommentId: newQuestionComment.id.toString(),
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
