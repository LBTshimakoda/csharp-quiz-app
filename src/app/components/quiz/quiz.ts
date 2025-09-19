// src/app/components/quiz/quiz.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { QuizData, QuizState, QuizCategory, AppState } from '../../models/quiz.model';
import { QuestionComponent } from '../question/question';
import { ResultsComponent } from '../results/results';
import { QuizSelectionComponent } from '../quiz-selection/quiz-selection';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuestionComponent, ResultsComponent, QuizSelectionComponent],
  template: `
    <div class="quiz-container">
      
      <!-- Quiz Selection View -->
      @if (appState.currentView === 'selection') {
        <app-quiz-selection (quizSelected)="onQuizSelected($event)"></app-quiz-selection>
      }

      <!-- Quiz View -->
      @if (appState.currentView === 'quiz') {
        
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
              <div class="error-actions">
                <button class="btn btn-primary" (click)="loadQuiz()">Try Again</button>
                <button class="btn btn-secondary" (click)="backToSelection()">Choose Different Quiz</button>
              </div>
            </div>
          </div>
        }

        <!-- Quiz Content -->
        @if (!loading && !error && quizData && quizState) {
          <div class="quiz-content">
            
            <!-- Quiz Header with Back Button -->
            <div class="quiz-nav">
              <button class="back-btn" (click)="backToSelection()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
                <span>Back to Quiz Selection</span>
              </button>
            </div>
            
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
                
                <!-- Question Component -->
                <app-question 
                  [question]="quizData.questions[quizState.currentQuestionIndex]"
                  [selectedAnswer]="quizState.selectedAnswers[quizData.questions[quizState.currentQuestionIndex].id]"
                  [questionNumber]="quizState.currentQuestionIndex + 1"
                  [isFirstQuestion]="quizState.currentQuestionIndex === 0"
                  [isLastQuestion]="quizState.currentQuestionIndex === quizData.questions.length - 1"
                  [totalQuestions]="quizData.questions.length">
                </app-question>

              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .quiz-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .quiz-nav {
      margin-bottom: 16px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;
    }

    .back-btn:hover {
      background: #f9fafb;
      color: #374151;
      border-color: #d1d5db;
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

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
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

    .btn-large {
      padding: 16px 32px;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .quiz-nav {
        margin-bottom: 12px;
      }

      .back-btn {
        padding: 8px 12px;
        font-size: 13px;
      }

      .error-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .error-actions .btn {
        min-width: 200px;
      }
    }
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  quizData: QuizData | null = null;
  quizState: QuizState | null = null;
  appState: AppState = {
    currentView: 'selection',
    selectedQuiz: null
  };
  loading = false;
  error: string | null = null;

  quizService = inject(QuizService);
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscribeToQuizState();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onQuizSelected(category: QuizCategory): void {
    this.appState.selectedQuiz = category;
    this.appState.currentView = 'quiz';
    this.loadQuiz(category.dataFile);
  }

  loadQuiz(dataFile?: string): void {
    this.loading = true;
    this.error = null;
    
    const fileName = dataFile || this.appState.selectedQuiz?.dataFile || 'quiz-data.json';
    
    this.subscriptions.add(
      this.quizService.loadQuizData(fileName).subscribe({
        next: (data) => {
          this.quizData = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading quiz data:', error);
          this.error = `Failed to load quiz data from ${fileName}. Please try again.`;
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

  backToSelection(): void {
    this.quizService.resetQuiz();
    this.appState.currentView = 'selection';
    this.appState.selectedQuiz = null;
    this.quizData = null;
    this.error = null;
  }

  getProgressPercentage(): number {
    if (!this.quizState || !this.quizData) return 0;
    return Math.round(((this.quizState.currentQuestionIndex + 1) / this.quizData.questions.length) * 100);
  }
}