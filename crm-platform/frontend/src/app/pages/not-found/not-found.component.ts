import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon class="error-icon">error_outline</mat-icon>
            <h1 class="error-code">404</h1>
            <h2 class="error-title">Page Not Found</h2>
            <p class="error-message">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div class="action-buttons">
              <button mat-raised-button color="primary" routerLink="/home">
                <mat-icon>home</mat-icon>
                Go to Home
              </button>
              <button mat-raised-button routerLink="/customers">
                <mat-icon>people</mat-icon>
                View Customers
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 20px;
    }

    .not-found-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
    }

    .error-content {
      padding: 20px;
    }

    .error-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .error-code {
      font-size: 72px;
      font-weight: bold;
      margin: 0 0 16px 0;
      color: #3f51b5;
      line-height: 1;
    }

    .error-title {
      font-size: 24px;
      margin: 0 0 16px 0;
      color: #424242;
    }

    .error-message {
      font-size: 16px;
      color: #666;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .action-buttons button {
      min-width: 140px;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .not-found-container {
        padding: 16px;
        min-height: calc(100vh - 80px);
      }

      .error-content {
        padding: 16px;
      }

      .error-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
      }

      .error-code {
        font-size: 56px;
      }

      .error-title {
        font-size: 20px;
      }

      .error-message {
        font-size: 14px;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .action-buttons button {
        min-width: unset;
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .error-code {
        font-size: 48px;
      }

      .error-title {
        font-size: 18px;
      }
    }
  `]
})
export class NotFoundComponent {
}