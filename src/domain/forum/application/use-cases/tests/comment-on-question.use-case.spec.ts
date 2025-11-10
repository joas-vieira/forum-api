import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionCommentRepository } from '../../../../../../test/repositories/in-memory-question-comment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { CommentOnQuestionUseCase } from '../comment-on-question.use-case.js';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

describe('CommentOnQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository,
    );
  });

  it('should be able to comment on a question', async () => {
    const newQuestion = makeQuestionFactory();

    await inMemoryQuestionRepository.create(newQuestion);

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      content: 'New Comment',
    });

    expect(inMemoryQuestionCommentRepository.items[0]?.content).toEqual(
      'New Comment',
    );
  });
});
