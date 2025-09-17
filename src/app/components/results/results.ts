// src/app/components/results/results.ts

import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizData, QuizResult, QuizQuestion } from '../../models/quiz.model';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <!-- Header -->
      <div class="results-header">
        <div class="trophy-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34"></path>
            <rect x="7" y="6" width="10" height="14" rx="1"></rect>
          </svg>
        </div>
        <h1>Quiz Results</h1>
        <h2>{{ quizData.title }}</h2>
      </div>

      <!-- Score Display -->
      <div class="score-display">
        <div class="score-main" [ngClass]="getScoreColor()">
          <div class="score-numbers">
            {{ quizResult.correctAnswers }}/{{ quizResult.totalQuestions }}
          </div>
          <div class="score-percentage">
            {{ quizResult.percentage }}%
          </div>
        </div>
        <p class="score-message">{{ getScoreMessage() }}</p>
      </div>

      <!-- Answer Review -->
      <div class="answer-review">
        <h3>Review Your Answers:</h3>
        <div class="review-list">
          @for (question of quizData.questions; track question.id) {
            <div class="review-item">
              <div class="review-header">
                <div class="result-icon">
                  @if (isAnswerCorrect(question.id)) {
                    <svg 
                      class="icon-correct"
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                  } @else {
                    <svg 
                      class="icon-incorrect"
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  }
                </div>
                <div class="question-content">
                  <p class="question-text">
                    <strong>{{ $index + 1 }}. {{ question.question }}</strong>
                  </p>
                  <p class="user-answer">
                    <span class="answer-label">Your answer:</span>
                    <span class="answer-text">{{ getUserAnswer(question.id) }}</span>
                  </p>
                  @if (!isAnswerCorrect(question.id)) {
                    <p class="correct-answer">
                      <span class="answer-label">Correct answer:</span>
                      <span class="answer-text correct">{{ getCorrectAnswer(question.id) }}</span>
                    </p>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Restart Button -->
      <div class="restart-section">
        <button class="btn btn-primary btn-large" (click)="onRestartQuiz()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23,4 23,10 17,10"></polyline>
            <polyline points="1,20 1,14 7,14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          Take Quiz Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .results-header {
      text-align: center;
      margin-bottom: 32px;
      background-color: white;
      padding: 48px 32px;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .trophy-icon {
      margin-bottom: 24px;
    }

    .trophy-icon svg {
      color: #f59e0b;
    }

    .results-header h1 {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .results-header h2 {
      color: #6b7280;
      font-size: 1.25rem;
      font-weight: normal;
    }

    .score-display {
      text-align: center;
      background-color: white;
      padding: 48px 32px;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .score-main {
      margin-bottom: 24px;
    }

    .score-numbers {
      font-size: 4rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .score-percentage {
      font-size: 2rem;
      font-weight: 600;
    }

    .score-main.score-excellent .score-numbers,
    .score-main.score-excellent .score-percentage {
      color: #059669;
    }

    .score-main.score-good .score-numbers,
    .score-main.score-good .score-percentage {
      color: #d97706;
    }

    .score-main.score-needs-improvement .score-numbers,
    .score-main.score-needs-improvement .score-percentage {
      color: #dc2626;
    }

    .score-message {
      color: #374151;
      font-size: 1.125rem;
      line-height: 1.6;
      margin: 0;
    }

    .answer-review {
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 32px;
      margin-bottom: 32px;
    }

    .answer-review h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 24px;
    }

    .review-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .review-item {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      background-color: #f9fafb;
    }

    .review-item:hover {
      background-color: #f3f4f6;
    }

    .review-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .result-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .icon-correct {
      color: #059669;
    }

    .icon-incorrect {
      color: #dc2626;
    }

    .question-content {
      flex: 1;
    }

    .question-text {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .question-text strong {
      font-weight: inherit;
    }

    .user-answer,
    .correct-answer {
      font-size: 14px;
      margin-bottom: 8px;
    }

    .user-answer:last-child,
    .correct-answer:last-child {
      margin-bottom: 0;
    }

    .answer-label {
      font-weight: 600;
      color: #374151;
    }

    .answer-text {
      color: #6b7280;
    }

    .answer-text.correct {
      color: #059669;
      font-weight: 500;
    }

    .restart-section {
      text-align: center;
      padding: 32px;
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

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1d4ed8;
    }

    .btn-large {
      padding: 16px 32px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .results-header {
        padding: 32px 16px;
      }
      
      .results-header h1 {
        font-size: 2rem;
      }
      
      .results-header h2 {
        font-size: 1.125rem;
      }
      
      .score-display {
        padding: 32px 16px;
      }
      
      .score-numbers {
        font-size: 3rem;
      }
      
      .score-percentage {
        font-size: 1.75rem;
      }
      
      .score-message {
        font-size: 1rem;
      }
      
      .answer-review {
        padding: 20px 16px;
      }
      
      .answer-review h3 {
        font-size: 1.25rem;
      }
      
      .review-item {
        padding: 16px;
      }
      
      .review-header {
        gap: 12px;
      }
      
      .question-text {
        font-size: 14px;
      }
      
      .user-answer,
      .correct-answer {
        font-size: 13px;
      }
    }
  `]
})
export class ResultsComponent implements OnInit {
  @Input() quizData!: QuizData;
  @Output() restartQuiz = new EventEmitter<void>();

  quizResult!: QuizResult;
  private quizService = inject(QuizService);

  ngOnInit(): void {
    this.quizResult = this.quizService.calculateResults();
  }

  onRestartQuiz(): void {
    this.restartQuiz.emit();
  }

  getScoreColor(): string {
    const percentage = this.quizResult.percentage;
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    return 'score-needs-improvement';
  }

  getScoreMessage(): string {
    const percentage = this.quizResult.percentage;
    if (percentage >= 90) return 'Excellent! You have a strong understanding of C#!';
    if (percentage >= 80) return 'Great job! You know C# quite well!';
    if (percentage >= 70) return 'Good work! You have a solid foundation in C#.';
    if (percentage >= 60) return 'Not bad! Consider reviewing some C# concepts.';
    return 'Keep studying! There\'s room for improvement in your C# knowledge.';
  }

  getQuestionById(questionId: number): QuizQuestion | undefined {
    return this.quizData.questions.find(q => q.id === questionId);
  }

  isAnswerCorrect(questionId: number): boolean {
    const answer = this.quizResult.answers.find(a => a.questionId === questionId);
    return answer ? answer.isCorrect : false;
  }

  getUserAnswer(questionId: number): string {
    const answer = this.quizResult.answers.find(a => a.questionId === questionId);
    const question = this.getQuestionById(questionId);
    
    if (answer && question && answer.selectedOption !== undefined) {
      return question.options[answer.selectedOption];
    }
    return 'No answer selected';
  }

  getCorrectAnswer(questionId: number): string {
    const question = this.getQuestionById(questionId);
    return question ? question.options[question.correctAnswer] : '';
  }
}