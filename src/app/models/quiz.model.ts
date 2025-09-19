// src/app/models/quiz.model.ts

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string; // Extended explanation for the correct answer
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

// New interfaces for quiz selection
export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  estimatedTime: string;
  icon: string;
  color: string;
  dataFile: string;
  disabled: boolean;
}

export interface AppState {
  currentView: 'selection' | 'quiz';
  selectedQuiz: QuizCategory | null;
}