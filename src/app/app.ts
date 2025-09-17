// src/app/app.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      padding: 20px;
      background-color: #f8fafc;
    }
    
    @media (max-width: 768px) {
      .app-container {
        padding: 10px;
      }
    }
  `]
})
export class AppComponent {
  title = 'C# Quiz Application';
}