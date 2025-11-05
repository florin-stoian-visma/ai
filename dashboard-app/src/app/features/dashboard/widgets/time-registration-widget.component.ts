import { Component, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { WidgetContainerComponent } from '../../../shared/components/widget-container/widget-container.component';

interface TimeEntry {
  id: string;
  customer: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

@Component({
  selector: 'app-time-registration-widget',
  imports: [
    CommonModule,
    FormsModule,
    WidgetContainerComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <app-widget-container title="Time Registration">
      <div class="time-tracker">
        @if (currentEntry()) {
          <div class="active-timer">
            <div class="timer-display">
              <mat-icon class="pulse">schedule</mat-icon>
              <div class="timer-info">
                <div class="customer-label">{{ currentEntry()?.customer }}</div>
                <div class="elapsed-time">{{ formatDuration(elapsedTime()) }}</div>
                <div class="task-desc">{{ currentEntry()?.description }}</div>
              </div>
            </div>
            <button mat-raised-button color="warn" (click)="stopTimer()">
              <mat-icon>stop</mat-icon>
              Stop
            </button>
          </div>
        } @else {
          <div class="timer-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Customer</mat-label>
              <mat-select [(ngModel)]="selectedCustomer">
                @for (customer of customers; track customer) {
                  <mat-option [value]="customer">{{ customer }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Task Description</mat-label>
              <input matInput [(ngModel)]="taskDescription" placeholder="What are you working on?" />
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              (click)="startTimer()"
              [disabled]="!selectedCustomer() || !taskDescription()"
              class="start-button">
              <mat-icon>play_arrow</mat-icon>
              Start Timer
            </button>
          </div>
        }

        <div class="recent-entries">
          <h4>Today's Entries</h4>
          @if (todaysEntries().length === 0) {
            <p class="no-entries">No time entries yet today</p>
          } @else {
            <mat-list>
              @for (entry of todaysEntries(); track entry.id) {
                <mat-list-item>
                  <div class="entry-content">
                    <div class="entry-header">
                      <div class="entry-left">
                        <strong>{{ entry.customer }}</strong>
                        <span class="entry-details">{{ entry.description }}</span>
                      </div>
                      <div class="entry-right">
                        <span class="duration">{{ formatDuration(entry.duration!) }}</span>
                        <span class="entry-time">{{ entry.startTime | date:'HH:mm' }} - {{ entry.endTime | date:'HH:mm' }}</span>
                      </div>
                    </div>
                  </div>
                </mat-list-item>
              }
            </mat-list>

            <div class="total-time">
              <strong>Total Today:</strong>
              <span>{{ formatDuration(getTotalTime()) }}</span>
            </div>
          }
        </div>
      </div>
    </app-widget-container>
  `,
  styles: [`
    .time-tracker {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .active-timer {
      padding: 24px;
      background: linear-gradient(135deg, #7939b4 0%, #5d288c 100%);
      border-radius: 12px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        background-color: white !important;
        color: #7939b4 !important;
        font-weight: 500;

        mat-icon {
          color: #7939b4;
        }

        &:hover {
          background-color: #f3e5f5 !important;
        }
      }

      .timer-display {
        display: flex;
        align-items: center;
        gap: 16px;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;

          &.pulse {
            animation: pulse 2s ease-in-out infinite;
          }
        }

        .timer-info {
          .customer-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 4px;
          }

          .elapsed-time {
            font-size: 32px;
            font-weight: 500;
            margin-bottom: 4px;
          }

          .task-desc {
            font-size: 14px;
            opacity: 0.8;
          }
        }
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    .timer-form {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .full-width {
        width: 100%;
      }

      .start-button {
        height: 48px;
        font-size: 16px;
      }
    }

    .recent-entries {
      h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--mat-sys-on-surface);
      }

      .no-entries {
        text-align: center;
        padding: 32px;
        color: var(--mat-sys-on-surface-variant);
        font-size: 14px;
      }

      ::ng-deep mat-list {
        padding: 0;

        mat-list-item {
          border-bottom: 1px solid var(--mat-sys-outline-variant);
          height: auto !important;

          .mdc-list-item__content {
            display: block !important;
          }

          .entry-content {
            width: 100%;
            padding: 12px 0;
            display: block !important;

            .entry-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 4px;

              .entry-left {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;

                strong {
                  font-size: 14px;
                  color: var(--mat-sys-on-surface) !important;
                }
              }

              .entry-right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 2px;
                margin-left: 16px;

                .duration {
                  font-weight: 500;
                  font-size: 14px;
                  color: var(--mat-sys-primary) !important;
                }

                .entry-time {
                  font-size: 12px;
                  color: var(--mat-sys-on-surface-variant) !important;
                }
              }
            }

            .entry-details {
              font-size: 14px;
              color: var(--mat-sys-on-surface-variant) !important;
              padding-left: 0;
            }
          }
        }
      }

      .total-time {
        display: flex;
        justify-content: space-between;
        padding: 16px;
        margin-top: 8px;
        background-color: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
        border-radius: 8px;
        font-size: 16px;

        strong {
          font-weight: 500;
        }
      }
    }

    ::ng-deep .cdk-overlay-pane {
      z-index: 1000;
    }

    ::ng-deep .mat-mdc-select-panel {
      background-color: white !important;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
    }

    ::ng-deep .mat-mdc-option {
      background-color: white !important;
    }

    ::ng-deep .mat-mdc-option:hover {
      background-color: #f5f5f5 !important;
    }

    ::ng-deep .mat-mdc-option.mat-mdc-option-active {
      background-color: #e8e8e8 !important;
    }
  `]
})
export class TimeRegistrationWidgetComponent {
  customers = ['Tech Solutions AB', 'Digital Konsult AB', 'Nordic Systems', 'Acme Corp'];
  
  selectedCustomer = model('');
  taskDescription = model('');
  currentEntry = signal<TimeEntry | null>(null);
  todaysEntries = signal<TimeEntry[]>([]);
  elapsedTime = signal(0);
  private timerInterval: any;

  startTimer(): void {
    const entry: TimeEntry = {
      id: Date.now().toString(),
      customer: this.selectedCustomer(),
      description: this.taskDescription(),
      startTime: new Date()
    };

    this.currentEntry.set(entry);
    this.selectedCustomer.set('');
    this.taskDescription.set('');

    // Start elapsed time counter
    this.timerInterval = setInterval(() => {
      this.elapsedTime.update(t => t + 1);
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const entry = this.currentEntry()!;
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000);

    const completedEntry: TimeEntry = {
      ...entry,
      endTime,
      duration
    };

    this.todaysEntries.update(entries => [completedEntry, ...entries]);
    this.currentEntry.set(null);
    this.elapsedTime.set(0);
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getTotalTime(): number {
    return this.todaysEntries().reduce((total, entry) => total + (entry.duration || 0), 0);
  }
}
