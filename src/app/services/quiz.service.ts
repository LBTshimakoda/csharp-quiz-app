// src/app/services/quiz.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { QuizData, QuizAnswer, QuizResult, QuizState } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private http = inject(HttpClient);

  private quizData: QuizData | null = null;
  private quizStateSubject = new BehaviorSubject<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isCompleted: false,
    showResults: false
  });

  public quizState$ = this.quizStateSubject.asObservable();

  loadQuizData(): Observable<QuizData> {
    return this.http.get<QuizData>('../assets/quiz-data.json').pipe(
      map(data => {
        this.quizData = data;
        return data;
      })
    );
  }

  getQuizData(): QuizData | null {
    return this.quizData;
  }

  getCurrentState(): QuizState {
    return this.quizStateSubject.value;
  }

  updateCurrentQuestionIndex(index: number): void {
    const currentState = this.quizStateSubject.value;
    this.quizStateSubject.next({
      ...currentState,
      currentQuestionIndex: index
    });
  }

  saveAnswer(questionId: number, selectedOption: number): void {
    const currentState = this.quizStateSubject.value;
    const updatedAnswers = {
      ...currentState.selectedAnswers,
      [questionId]: selectedOption
    };

    this.quizStateSubject.next({
      ...currentState,
      selectedAnswers: updatedAnswers
    });
  }

  goToNextQuestion(): void {
    const currentState = this.quizStateSubject.value;
    const totalQuestions = this.quizData?.questions.length || 0;
    
    if (currentState.currentQuestionIndex < totalQuestions - 1) {
      this.updateCurrentQuestionIndex(currentState.currentQuestionIndex + 1);
    } else {
      this.completeQuiz();
    }
  }

  goToPreviousQuestion(): void {
    const currentState = this.quizStateSubject.value;
    if (currentState.currentQuestionIndex > 0) {
      this.updateCurrentQuestionIndex(currentState.currentQuestionIndex - 1);
    }
  }

  completeQuiz(): void {
    const currentState = this.quizStateSubject.value;
    this.quizStateSubject.next({
      ...currentState,
      isCompleted: true
    });
  }

  showResults(): void {
    const currentState = this.quizStateSubject.value;
    this.quizStateSubject.next({
      ...currentState,
      showResults: true
    });
  }

  calculateResults(): QuizResult {
    const currentState = this.quizStateSubject.value;
    const answers: QuizAnswer[] = [];
    let correctCount = 0;

    if (this.quizData) {
      this.quizData.questions.forEach(question => {
        const selectedOption = currentState.selectedAnswers[question.id];
        const isCorrect = selectedOption === question.correctAnswer;
        
        if (isCorrect) {
          correctCount++;
        }

        answers.push({
          questionId: question.id,
          selectedOption: selectedOption,
          isCorrect: isCorrect
        });
      });
    }

    const totalQuestions = this.quizData?.questions.length || 0;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return {
      totalQuestions,
      correctAnswers: correctCount,
      score: correctCount,
      percentage,
      answers
    };
  }

  resetQuiz(): void {
    this.quizStateSubject.next({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isCompleted: false,
      showResults: false
    });
  }

  isQuestionAnswered(questionIndex: number): boolean {
    const currentState = this.quizStateSubject.value;
    const question = this.quizData?.questions[questionIndex];
    return question ? currentState.selectedAnswers[question.id] !== undefined : false;
  }

  getTotalAnswered(): number {
    const currentState = this.quizStateSubject.value;
    return Object.keys(currentState.selectedAnswers).length;
  }
}