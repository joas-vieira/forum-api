import { left, right, type Either } from '@/core/either.js';
import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment.entity.js';
import type { Question } from '../../enterprise/entities/question.entity.js';
import type { QuestionRepository } from '../repositories/question.repository.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';
import type { QuestionAttachmentRepository } from '../repositories/question-attachment.repository.js';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list.entity.js';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId && question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId);

    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueId(attachmentId),
      }),
    );

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
