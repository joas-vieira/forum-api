import { left, right, type Either } from '@/core/either.js';
import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.entity.js';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.entity.js';
import { Answer } from '../../enterprise/entities/answer.entity.js';
import type { AnswerAttachmentRepository } from '../repositories/answer-attachment.repository.js';
import type { AnswerRepository } from '../repositories/answer.repository.js';
import { NotAllowedError } from '@/core/use-cases/errors/not-allowed.error.js';
import { ResourceNotFoundError } from '@/core/use-cases/errors/resource-not-found.error.js';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly answerAttachmentRepository: AnswerAttachmentRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId && answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId);

    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueId(attachmentId),
      }),
    );

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answerRepository.save(answer);

    return right({ answer });
  }
}
