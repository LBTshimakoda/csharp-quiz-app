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
  template: `
    <div class="question-container">
      <!-- Question -->
      <div class="question-content">
        <h2 class="question-title">
          {{ questionNumber }}. {{ question.question }}
        </h2>

        <!-- Options -->
        <div class="options-container">
          @for (option of shuffledOptions; track option.originalIndex) {
            <button
              class="option-button"
              [ngClass]="{ 'selected': selectedOption === option.originalIndex }"
              (click)="onOptionSelect(option.originalIndex)">
              <div class="option-radio">
                <div class="radio-outer">
                  @if (selectedOption === option.originalIndex) {
                    <div class="radio-inner"></div>
                  }
                </div>
              </div>
              <span class="option-text">{{ option.text }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Navigation -->
      <div class="navigation-container">
        <button
          class="btn btn-secondary"
          [disabled]="isFirstQuestion"
          (click)="onPrevious()">
          Previous
        </button>

        <div class="answer-status">
          @if (isAnswerSelected) {
            <span class="answer-selected">
              ✓ Answer selected
            </span>
          }
        </div>

        <button
          class="btn btn-primary"
          [disabled]="!isAnswerSelected"
          (click)="onNext()">
          {{ nextButtonText }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .question-container {
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .question-content {
      padding: 32px;
    }

    .question-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 32px;
      line-height: 1.4;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .option-button {
      width: 100%;
      text-align: left;
      padding: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background-color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .option-button:hover {
      border-color: #d1d5db;
      background-color: #f9fafb;
    }

    .option-button.selected {
      border-color: #2563eb;
      background-color: #eff6ff;
    }

    .option-button.selected .option-text {
      color: #1e40af;
    }

    .option-radio {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .radio-outer {
      width: 24px;
      height: 24px;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s ease;
    }

    .option-button.selected .radio-outer {
      border-color: #2563eb;
      background-color: #2563eb;
    }

    .radio-inner {
      width: 10px;
      height: 10px;
      background-color: white;
      border-radius: 50%;
    }

    .option-text {
      color: #374151;
      font-size: 16px;
      line-height: 1.5;
      flex: 1;
    }

    .navigation-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .answer-status {
      font-size: 14px;
    }

    .answer-selected {
      color: #059669;
      font-weight: 500;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #d1d5db;
    }

    @media (max-width: 768px) {
      .question-content {
        padding: 24px 16px;
      }
      
      .question-title {
        font-size: 1.25rem;
        margin-bottom: 24px;
      }
      
      .option-button {
        padding: 16px;
        gap: 12px;
      }
      
      .option-text {
        font-size: 15px;
      }
      
      .navigation-container {
        padding: 16px;
        flex-direction: column;
        gap: 16px;
      }
      
      .answer-status {
        order: -1;
      }
      
      .navigation-container > div:last-child {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
  `]
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