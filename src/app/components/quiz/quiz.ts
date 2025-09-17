// src/app/components/quiz/quiz.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { QuizData, QuizState } from '../../models/quiz.model';
import { QuestionComponent } from '../question/question';
import { ResultsComponent } from '../results/results';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuestionComponent, ResultsComponent],
  template: `
    <div class="quiz-container">
      <!-- Loading State -->
      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      }

      <!-- Error State -->
      @if (error) {
        <div class="error-container">
          <div class="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>{{ error }}</p>
            <button class="btn btn-primary" (click)="loadQuiz()">Try Again</button>
          </div>
        </div>
      }

      <!-- Quiz Content -->
      @if (!loading && !error && quizData && quizState) {
        <div class="quiz-content">
          
          <!-- Show Results -->
          @if (quizState.showResults) {
            <app-results 
              [quizData]="quizData"
              (restartQuiz)="onRestartQuiz()">
            </app-results>
          }

          <!-- Quiz Completion Screen -->
          @if (quizState.isCompleted && !quizState.showResults) {
            <div class="completion-container">
              <div class="completion-content">
                <div class="completion-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                  </svg>
                </div>
                <h1>Quiz Completed!</h1>
                <p>You've answered all {{ quizData.questions.length }} questions.</p>
                <p>Ready to see your results? Click the button below to find out how well you did!</p>
                <button class="btn btn-primary btn-large" (click)="quizService.showResults()">
                  Show Results
                </button>
              </div>
            </div>
          }

          <!-- Active Quiz -->
          @if (!quizState.isCompleted && !quizState.showResults) {
            <div class="active-quiz">
              <!-- Header -->
              <div class="quiz-header">
                <div class="quiz-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h1>{{ quizData.title }}</h1>
                <p>{{ quizData.description }}</p>
              </div>

              <!-- Progress Bar -->
              <div class="progress-section">
                <div class="progress-info">
                  <span>Question {{ quizState.currentQuestionIndex + 1 }} of {{ quizData.questions.length }}</span>
                  <span>{{ getProgressPercentage() }}% Complete</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    [style.width.%]="getProgressPercentage()">
                  </div>
                </div>
              </div>

              <!-- Question Component -->
              <app-question 
                [question]="quizData.questions[quizState.currentQuestionIndex]"
                [selectedAnswer]="quizState.selectedAnswers[quizData.questions[quizState.currentQuestionIndex].id]"
                [questionNumber]="quizState.currentQuestionIndex + 1"
                [isFirstQuestion]="quizState.currentQuestionIndex === 0"
                [isLastQuestion]="quizState.currentQuestionIndex === quizData.questions.length - 1"
                [totalQuestions]="quizData.questions.length">
              </app-question>

              <!-- Progress Summary -->
              <div class="progress-summary">
                <h3>Progress Summary:</h3>
                <div class="question-indicators">
                  @for (question of quizData.questions; track $index) {
                    <div 
                      class="question-indicator"
                      [ngClass]="{
                        'current': $index === quizState.currentQuestionIndex,
                        'answered': quizService.isQuestionAnswered($index),
                        'unanswered': !quizService.isQuestionAnswered($index) && $index !== quizState.currentQuestionIndex
                      }">
                      {{ $index + 1 }}
                    </div>
                  }
                </div>
                <p class="summary-text">
                  Answered: {{ quizService.getTotalAnswered() }} / {{ quizData.questions.length }}
                </p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .quiz-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #6b7280;
      font-size: 16px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .error-message {
      text-align: center;
      padding: 32px;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      max-width: 500px;
    }

    .error-message h2 {
      color: #dc2626;
      margin-bottom: 16px;
    }

    .error-message p {
      color: #7f1d1d;
      margin-bottom: 24px;
    }

    .completion-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 500px;
    }

    .completion-content {
      text-align: center;
      background-color: white;
      padding: 48px 32px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }

    .completion-icon {
      margin-bottom: 24px;
    }

    .completion-icon svg {
      color: #059669;
    }

    .completion-content h1 {
      font-size: 2rem;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .completion-content p {
      color: #6b7280;
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .quiz-header {
      text-align: center;
      margin-bottom: 32px;
      background-color: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .quiz-icon {
      margin-bottom: 16px;
    }

    .quiz-icon svg {
      color: #2563eb;
    }

    .quiz-header h1 {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .quiz-header p {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .progress-section {
      margin-bottom: 32px;
      background-color: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      color: #6b7280;
    }

    .progress-bar {
      width: 100%;
      height: 12px;
      background-color: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background-color: #2563eb;
      transition: width 0.3s ease;
      border-radius: 6px;
    }

    .progress-summary {
      background-color: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-top: 32px;
    }

    .progress-summary h3 {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .question-indicators {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .question-indicator {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .question-indicator.current {
      background-color: #2563eb;
      color: white;
    }

    .question-indicator.answered {
      background-color: #dcfce7;
      color: #166534;
    }

    .question-indicator.unanswered {
      background-color: #e5e7eb;
      color: #6b7280;
    }

    .summary-text {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
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

    .btn-large {
      padding: 16px 32px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .quiz-header {
        padding: 24px 16px;
      }
      
      .quiz-header h1 {
        font-size: 2rem;
      }
      
      .progress-section,
      .progress-summary {
        padding: 16px;
      }
      
      .question-indicators {
        justify-content: center;
      }
      
      .question-indicator {
        width: 32px;
        height: 32px;
        font-size: 13px;
      }
    }
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  quizData: QuizData | null = null;
  quizState: QuizState | null = null;
  loading = true;
  error: string | null = null;

  quizService = inject(QuizService);
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.loadQuiz();
    this.subscribeToQuizState();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadQuiz(): void {
    this.loading = true;
    this.error = null;
    this.subscriptions.add(
      this.quizService.loadQuizData().subscribe({
        next: (data) => {
          this.quizData = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading quiz data:', error);
          this.error = 'Failed to load quiz data. Please try again.';
          this.loading = false;
        }
      })
    );
  }

  private subscribeToQuizState(): void {
    this.subscriptions.add(
      this.quizService.quizState$.subscribe(state => {
        this.quizState = state;
      })
    );
  }

  onRestartQuiz(): void {
    this.quizService.resetQuiz();
  }

  getProgressPercentage(): number {
    if (!this.quizState || !this.quizData) return 0;
    return Math.round(((this.quizState.currentQuestionIndex + 1) / this.quizData.questions.length) * 100);
  }
}
