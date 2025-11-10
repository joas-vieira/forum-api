import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug.value-object.js';
import { makeQuestionFactory } from '../../../../../../test/factories/make-question.factory.js';
import { InMemoryQuestionAttachmentRepository } from '../../../../../../test/repositories/in-memory-question-attachment.repository.js';
import { InMemoryQuestionRepository } from '../../../../../../test/repositories/in-memory-question.repository.js';
import { GetQuestionBySlugUseCase } from '../get-question-by-slug.use-case.js';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: GetQuestionBySlugUseCase;

describe('GetQuestionBySlugUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it('should be able get a question by slug', async () => {
    const newQuestion = makeQuestionFactory({
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionRepository.create(newQuestion);

    const response = await sut.execute({
      slug: 'example-question',
    });

    expect(response.isRight()).toBe(true);

    if (response.isRight()) {
      expect(response.value.question.id).toBeTruthy();
      expect(response.value.question.title).toEqual(newQuestion.title);
    }
  });
});
