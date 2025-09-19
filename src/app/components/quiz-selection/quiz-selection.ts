// src/app/components/quiz-selection/quiz-selection.ts

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizCategory } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="selection-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        <h1>Programming Quiz Hub</h1>
        <p>Choose a quiz topic to test your knowledge and improve your skills</p>
      </div>

      <!-- Quiz Categories Grid -->
      <div class="categories-grid">
        @for (category of quizCategories; track category.id) {
          <div 
            class="category-card"
            [ngClass]="'category-' + category.color"
            (click)="selectQuiz(category)">
            
            <!-- Category Icon -->
            <div class="category-icon">
              <div [innerHTML]="category.icon"></div>
            </div>

            <!-- Category Info -->
            <div class="category-info">
              <h3>{{ category.title }}</h3>
              <p class="category-description">{{ category.description }}</p>
              
              <div class="category-meta">
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                  </svg>
                  <span>{{ category.difficulty }}</span>
                </div>
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11H3l9 9 9-9h-6V3z"></path>
                  </svg>
                  <span>{{ category.questionCount }} questions</span>
                </div>
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span>{{ category.estimatedTime }}</span>
                </div>
              </div>
            </div>

            <!-- Start Button -->
            <div class="category-action">
              <button class="start-btn" [disabled]="category.disabled">
                <span>Start Quiz</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <p>💡 Tip: Each quiz randomizes answer options to ensure better learning!</p>
      </div>
    </div>
  `,
  styles: [`
    .start-btn:disabled {
      background: #9ca3af; /* gray */
      cursor: not-allowed;
      transform: none;
    }
    
    .start-btn:disabled:hover {
      background: #9ca3af; /* keep same gray */
      transform: none;     /* prevent hover shift */
      box-shadow: none;    /* remove any hover shadow if added */
    }
    
    .selection-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .header-section {
      text-align: center;
      margin-bottom: 48px;
    }

    .header-icon {
      margin-bottom: 24px;
    }

    .header-icon svg {
      color: #2563eb;
    }

    .header-section h1 {
      font-size: 3rem;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .header-section p {
      font-size: 1.25rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .category-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
    }

    .category-card:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      transition: all 0.3s ease;
    }

    .category-blue:before { background: linear-gradient(90deg, #2563eb, #1d4ed8); }
    .category-green:before { background: linear-gradient(90deg, #059669, #047857); }
    .category-purple:before { background: linear-gradient(90deg, #7c3aed, #6d28d9); }
    .category-orange:before { background: linear-gradient(90deg, #ea580c, #dc2626); }

    .category-card:hover:before {
      height: 6px;
    }

    .category-icon {
      margin-bottom: 24px;
    }

    .category-icon svg {
      width: 48px;
      height: 48px;
    }

    .category-blue .category-icon svg { color: #2563eb; }
    .category-green .category-icon svg { color: #059669; }
    .category-purple .category-icon svg { color: #7c3aed; }
    .category-orange .category-icon svg { color: #ea580c; }

    .category-info h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 12px;
    }

    .category-description {
      color: #6b7280;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .category-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 24px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #374151;
    }

    .meta-item svg {
      color: #6b7280;
    }

    .category-action {
      display: flex;
      justify-content: flex-end;
    }

    .start-btn {
      background: linear-gradient(90deg, #2563eb, #1d4ed8);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .start-btn:hover {
      background: linear-gradient(90deg, #1d4ed8, #1e40af);
      transform: translateX(2px);
    }

    .footer-section {
      text-align: center;
      padding: 32px;
      background: rgba(59, 130, 246, 0.05);
      border-radius: 12px;
    }

    .footer-section p {
      color: #6b7280;
      font-size: 16px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .selection-container {
        padding: 20px 16px;
      }

      .header-section h1 {
        font-size: 2.25rem;
      }

      .header-section p {
        font-size: 1.125rem;
      }

      .categories-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .category-card {
        padding: 24px;
      }

      .category-meta {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class QuizSelectionComponent {
  @Output() quizSelected = new EventEmitter<QuizCategory>();

  quizCategories: QuizCategory[] = [
    {
      id: 'csharp-advanced',
      title: 'C# Advanced Mastery',
      description: 'Master advanced C# concepts including LINQ, generics, delegates, events, async programming, design patterns, and .NET internals.',
      difficulty: 'Advanced',
      questionCount: 40,
      estimatedTime: '35-45 min',
      color: 'blue',
      dataFile: 'csharp-advanced.json',
      disabled: false, 
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="16,18 22,12 16,6"></polyline>
        <polyline points="8,6 2,12 8,18"></polyline>
      </svg>`
    },
    {
      id: 'javascript-fundamentals',
      title: 'JavaScript Essentials',
      description: 'Explore JavaScript fundamentals, ES6+ features, DOM manipulation, and async programming.',
      difficulty: 'Beginner',
      questionCount: 25,
      estimatedTime: '18-25 min',
      color: 'orange',
      dataFile: 'javascript-fundamentals.json',
      disabled: false, 
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        <path d="M10 8h4"></path>
        <path d="M10 12h4"></path>
        <path d="M10 16h2"></path>
      </svg>`
    },
    {
      id: 'angular-concepts',
      title: 'Angular Deep Dive',
      description: 'Master Angular components, services, routing, forms, and modern Angular patterns.',
      difficulty: 'Advanced',
      questionCount: 30,
      estimatedTime: '25-30 min',
      color: 'green',
      dataFile: 'angular-concepts.json',
      disabled: false,
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"></polygon>
        <polygon points="12,7 19,10 19,14 12,17 5,14 5,10"></polygon>
        <polygon points="12,12 16,13.5 16,15.5 12,17 8,15.5 8,13.5"></polygon>
      </svg>`
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Test your HTML, CSS, responsive design, and modern web development practices.',
      difficulty: 'Beginner',
      questionCount: 22,
      estimatedTime: '16-22 min',
      color: 'purple',
      dataFile: 'web-development.json',
      disabled: false,
      icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>`
    }
  ];

  selectQuiz(category: QuizCategory): void {
    this.quizSelected.emit(category);
  }
}