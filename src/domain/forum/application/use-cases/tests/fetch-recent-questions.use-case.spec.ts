import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { FetchRecentQuestionsUseCase } from '../fetch-recent-questions.use-case.js';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: FetchRecentQuestionsUseCase;

describe('FetchRecentQuestionsUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository);
  });

  it('should be able fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestionFactory({
        createdAt: new Date(2024, 0, 20),
      }),
    );
    await inMemoryQuestionRepository.create(
      makeQuestionFactory({
        createdAt: new Date(2024, 0, 18),
      }),
    );
    await inMemoryQuestionRepository.create(
      makeQuestionFactory({
        createdAt: new Date(2024, 0, 23),
      }),
    );

    const response = await sut.execute({
      page: 1,
    });

    expect(response.value?.questions).toHaveLength(3);
    expect(response.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ]);
  });

  it('should be able fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionRepository.create(makeQuestionFactory());
    }

    const response = await sut.execute({
      page: 2,
    });

    expect(response.value?.questions).toHaveLength(2);
  });
});
