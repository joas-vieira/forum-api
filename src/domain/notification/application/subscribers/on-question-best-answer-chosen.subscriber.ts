import { DomainEvents } from '@/core/events/domain-events.js';
import type { EventHandler } from '@/core/events/event-handler.js';
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer.repository.js';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen.event.js';
import type { SendNotificationUseCase } from '../use-cases/send-notification.use-case.js';

export class OnQuestionBestAnswerChosenSubscriber implements EventHandler {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswer.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswer({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A sua resposta da pergunta "${question.title}" foi escolhida como a melhor resposta.`,
      });
    }
  }
}
