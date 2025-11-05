import { Component, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WidgetContainerComponent } from '../../../shared/components/widget-container/widget-container.component';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-assistant-widget',
  imports: [CommonModule, FormsModule, WidgetContainerComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <app-widget-container title="AI Assistant">
      <div class="chat-container">
        <div class="messages-list">
          @for (message of messages(); track message.timestamp) {
            <div class="message" [class]="'message-' + message.role">
              <div class="message-avatar">
                <mat-icon>{{ message.role === 'user' ? 'person' : 'smart_toy' }}</mat-icon>
              </div>
              <div class="message-content">
                <div class="message-text">{{ message.content }}</div>
                <div class="message-time">{{ message.timestamp | date:'short' }}</div>
              </div>
            </div>
          }
        </div>

        <div class="input-container">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Ask me anything...</mat-label>
            <input matInput [(ngModel)]="userInput" (keyup.enter)="sendMessage()" />
            <button mat-icon-button matSuffix (click)="sendMessage()" [disabled]="!userInput()">
              <mat-icon>send</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <div class="suggestions">
          <strong>Quick actions:</strong>
          <div class="suggestion-chips">
            <button mat-button (click)="askQuestion('What widgets can I add?')">Available Widgets</button>
            <button mat-button (click)="askQuestion('Show customer list')">Customers</button>
            <button mat-button (click)="askQuestion('Material inventory status')">Inventory</button>
          </div>
        </div>
      </div>
    </app-widget-container>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .messages-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 250px;

      .message {
        display: flex;
        gap: 12px;

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        .message-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .message-text {
            padding: 12px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
          }

          .message-time {
            font-size: 11px;
            color: var(--mat-sys-on-surface-variant);
            padding: 0 4px;
          }
        }

        &.message-user {
          .message-avatar {
            background-color: var(--mat-sys-primary-container);
            color: var(--mat-sys-on-primary-container);
          }

          .message-text {
            background-color: var(--mat-sys-primary-container);
            color: var(--mat-sys-on-primary-container);
          }
        }

        &.message-assistant {
          .message-avatar {
            background-color: var(--mat-sys-tertiary-container);
            color: var(--mat-sys-on-tertiary-container);
          }

          .message-text {
            background-color: var(--mat-sys-surface-container);
            color: var(--mat-sys-on-surface);
          }
        }
      }
    }

    .input-container {
      padding: 16px 0;
      border-top: 1px solid var(--mat-sys-outline-variant);

      .full-width {
        width: 100%;
      }
    }

    .suggestions {
      padding-top: 8px;

      strong {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        color: var(--mat-sys-on-surface-variant);
      }

      .suggestion-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        button {
          font-size: 12px;
        }
      }
    }
  `]
})
export class AiAssistantWidgetComponent {
  userInput = model('');
  messages = signal<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with widget management, answer questions about your business data, and provide insights. How can I assist you today?',
      timestamp: new Date()
    }
  ]);

  sendMessage(): void {
    const input = this.userInput().trim();
    if (!input) return;

    // Add user message
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', content: input, timestamp: new Date() }
    ]);

    // Clear input
    this.userInput.set('');

    // Simulate AI response
    setTimeout(() => {
      const response = this.generateResponse(input);
      this.messages.update(msgs => [
        ...msgs,
        { role: 'assistant', content: response, timestamp: new Date() }
      ]);
    }, 500);
  }

  askQuestion(question: string): void {
    this.userInput.set(question);
    this.sendMessage();
  }

  private generateResponse(input: string): string {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('widget')) {
      return 'You can add various widgets to your dashboard including Financial Overview, Today\'s Schedule, Projects Pipeline, and Time Registration. Would you like to add a specific widget?';
    } else if (lowerInput.includes('customer')) {
      return 'I can see you have 12 active customers. The most recent interactions were with Andersson Family and Bergström Villa. Would you like detailed information about any specific customer?';
    } else if (lowerInput.includes('inventory') || lowerInput.includes('material')) {
      return 'Current inventory status: Pine boards are running low (15% remaining), oak veneer is well-stocked. You might want to order more pine boards for upcoming projects.';
    } else {
      return 'I\'m here to help! You can ask me about widgets, customers, projects, inventory, or any other business-related questions.';
    }
  }
}
