// src/app/components/question/question.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz.service';

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.html',
  styleUrls: ['./question.scss']
})
export class QuestionComponent implements OnInit, OnChanges {
  @Input() question!: QuizQuestion;
  @Input() selectedAnswer: number | undefined;
  @Input() questionNumber!: number;
  @Input() isFirstQuestion!: boolean;
  @Input() isLastQuestion!: boolean;
  @Input() totalQuestions!: number;

  selectedOption: number | null = null;
  shuffledOptions: ShuffledOption[] = [];

  private quizService = inject(QuizService);

  ngOnInit(): void {
    this.updateSelectedOption();
    this.shuffleOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset selection and shuffle options when question changes
    if (changes['question']) {
      this.shuffleOptions();
      this.updateSelectedOption();
    } else if (changes['selectedAnswer']) {
      this.updateSelectedOption();
    }
  }

  private shuffleOptions(): void {
    // Create array with original indices
    const optionsWithIndices: ShuffledOption[] = this.question.options.map((text, index) => ({
      text,
      originalIndex: index
    }));

    // Fisher-Yates shuffle algorithm
    for (let i = optionsWithIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
    }

    this.shuffledOptions = optionsWithIndices;
  }

  private updateSelectedOption(): void {
    // Only set selectedOption if there's actually a saved answer for this question
    this.selectedOption = this.selectedAnswer !== undefined ? this.selectedAnswer : null;
  }

  onOptionSelect(originalIndex: number): void {
    this.selectedOption = originalIndex;
    this.quizService.saveAnswer(this.question.id, originalIndex);
  }

  onPrevious(): void {
    this.quizService.goToPreviousQuestion();
  }

  onNext(): void {
    if (this.selectedOption !== null) {
      this.quizService.goToNextQuestion();
    }
  }

  get isAnswerSelected(): boolean {
    return this.selectedOption !== null;
  }

  get nextButtonText(): string {
    return this.isLastQuestion ? 'Finish Quiz' : 'Next Question';
  }
}