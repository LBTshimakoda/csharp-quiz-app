// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/quiz/quiz').then(m => m.QuizComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];