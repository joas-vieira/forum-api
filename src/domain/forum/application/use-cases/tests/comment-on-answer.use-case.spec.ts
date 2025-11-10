import { makeAnswerFactory } from '../../../../../../test/factories/make-answer.factory.js';
import { InMemoryAnswerAttachmentRepository } from '../../../../../../test/repositories/in-memory-answer-attachment.repository.js';
import { InMemoryAnswerCommentRepository } from '../../../../../../test/repositories/in-memory-answer-comment.repository.js';
import { InMemoryAnswerRepository } from '../../../../../../test/repositories/in-memory-answer.repository.js';
import { CommentOnAnswerUseCase } from '../comment-on-answer.use-case.js';

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: CommentOnAnswerUseCase;

describe('CommentOnAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
    );
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentRepository,
    );
  });

  it('should be able to comment on a answer', async () => {
    const newAnswer = makeAnswerFactory();

    await inMemoryAnswerRepository.create(newAnswer);

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'author-1',
      content: 'New Comment',
    });

    expect(inMemoryAnswerCommentRepository.items[0]?.content).toEqual(
      'New Comment',
    );
  });
});
