// src/app/models/quiz.model.ts

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizData {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  answers: QuizAnswer[];
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: number]: number };
  isCompleted: boolean;
  showResults: boolean;
}