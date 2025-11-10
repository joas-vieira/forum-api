import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { makeAnswerCommentFactory } from '../../../../../../test/factories/make-answer-comment.factory.js';
import { InMemoryAnswerCommentRepository } from '../../../../../../test/repositories/in-memory-answer-comment.repository.js';
import { DeleteAnswerCommentUseCase } from '../delete-answer-comment.use-case.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: DeleteAnswerCommentUseCase;

describe('DeleteAnswerCommentUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository);
  });

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerCommentFactory();

    await inMemoryAnswerCommentRepository.create(newAnswerComment);

    await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      answerCommentId: newAnswerComment.id.toString(),
    });

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answer comment from another author', async () => {
    const newAnswerComment = makeAnswerCommentFactory({
      authorId: new UniqueId('author-1'),
    });

    await inMemoryAnswerCommentRepository.create(newAnswerComment);

    const response = await sut.execute({
      authorId: 'author-2',
      answerCommentId: newAnswerComment.id.toString(),
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
