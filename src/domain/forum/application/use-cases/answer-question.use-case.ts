import { right, type Either } from '@/core/either.js';
import { UniqueId } from '@/core/entities/value-objects/unique-id.value-object.js';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.entity.js';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.entity.js';
import { Answer } from '../../enterprise/entities/answer.entity.js';
import type { AnswerRepository } from '../repositories/answer.repository.js';

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

export class AnswerQuestionUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueId(instructorId),
      questionId: new UniqueId(questionId),
      content,
    });

    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueId(attachmentId),
      }),
    );

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);

    return right({ answer });
  }
}
