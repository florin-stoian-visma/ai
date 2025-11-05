import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { WidgetContainerComponent } from '../../../shared/components/widget-container/widget-container.component';

interface Project {
  id: string;
  name: string;
  customer: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  actionItems: ActionItem[];
  dueDate: string;
}

interface ActionItem {
  type: 'material' | 'invoice' | 'permit' | 'inspection';
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

interface Tip {
  type: 'warning' | 'info' | 'success';
  message: string;
}

@Component({
  selector: 'app-projects-pipeline-widget',
  imports: [CommonModule, WidgetContainerComponent, MatIconModule, MatChipsModule, MatBadgeModule],
  template: `
    <app-widget-container title="Projects Pipeline">
      @if (tips().length > 0) {
        <div class="tips-section">
          @for (tip of tips(); track tip.message) {
            <div class="tip-card" [class]="'tip-' + tip.type">
              <mat-icon>{{ getTipIcon(tip.type) }}</mat-icon>
              <span>{{ tip.message }}</span>
            </div>
          }
        </div>
      }

      <div class="projects-list">
        @for (project of activeProjects(); track project.id) {
          <div class="project-card" [class]="'status-' + project.status">
            <div class="project-header">
              <div>
                <h4>{{ project.name }}</h4>
                <span class="customer-name">{{ project.customer }}</span>
              </div>
              <mat-chip [class]="'status-chip-' + project.status">
                {{ getStatusLabel(project.status) }}
              </mat-chip>
            </div>

            <div class="progress-section">
              <div class="progress-info">
                <span>Progress</span>
                <strong>{{ project.progress }}%</strong>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="project.progress"></div>
              </div>
              <div class="due-date">
                <mat-icon>event</mat-icon>
                <span>Due: {{ project.dueDate }}</span>
              </div>
            </div>

            @if (project.actionItems.length > 0) {
              <div class="action-items">
                <strong>
                  <mat-icon>notification_important</mat-icon>
                  Action Required
                </strong>
                <div class="actions-list">
                  @for (action of project.actionItems; track action.description) {
                    <div class="action-item" [class]="'priority-' + action.priority">
                      <mat-icon>{{ getActionIcon(action.type) }}</mat-icon>
                      <div class="action-content">
                        <span class="action-description">{{ action.description }}</span>
                        @if (action.dueDate) {
                          <span class="action-due">Due: {{ action.dueDate }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </app-widget-container>
  `,
  styles: [`
    .tips-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;

      .tip-card {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &.tip-warning {
          background-color: #fff3e0;
          color: #e65100;
          border-left: 4px solid #ff9800;

          mat-icon {
            color: #ff9800;
          }
        }

        &.tip-info {
          background-color: #e3f2fd;
          color: #0d47a1;
          border-left: 4px solid #2196f3;

          mat-icon {
            color: #2196f3;
          }
        }

        &.tip-success {
          background-color: #e8f5e9;
          color: #1b5e20;
          border-left: 4px solid #4caf50;

          mat-icon {
            color: #4caf50;
          }
        }
      }
    }

    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .project-card {
      padding: 16px;
      border-radius: 8px;
      border: 1px solid var(--mat-sys-outline-variant);
      background-color: var(--mat-sys-surface-container-low);

      &.status-at-risk {
        border-left: 4px solid #ff9800;
      }

      &.status-delayed {
        border-left: 4px solid #f44336;
      }

      &.status-on-track {
        border-left: 4px solid #4caf50;
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;

        h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 500;
          color: var(--mat-sys-on-surface);
        }

        .customer-name {
          font-size: 14px;
          color: var(--mat-sys-on-surface-variant);
        }

        mat-chip {
          font-size: 12px;

          &.status-chip-on-track {
            background-color: #e8f5e9;
            color: #2e7d32;
          }

          &.status-chip-at-risk {
            background-color: #fff3e0;
            color: #e65100;
          }

          &.status-chip-delayed {
            background-color: #ffebee;
            color: #c62828;
          }
        }
      }

      .progress-section {
        margin-bottom: 16px;

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--mat-sys-on-surface-variant);

          strong {
            color: var(--mat-sys-on-surface);
          }
        }

        .progress-bar {
          height: 8px;
          background-color: var(--mat-sys-surface-container);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;

          .progress-fill {
            height: 100%;
            background-color: var(--mat-sys-primary);
            transition: width 0.3s ease;
          }
        }

        .due-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--mat-sys-on-surface-variant);

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .action-items {
        padding-top: 16px;
        border-top: 1px solid var(--mat-sys-outline-variant);

        strong {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
          font-size: 14px;
          color: var(--mat-sys-on-surface);

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #ff9800;
          }
        }

        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .action-item {
            display: flex;
            gap: 8px;
            padding: 8px;
            border-radius: 6px;
            background-color: var(--mat-sys-surface-container);

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              flex-shrink: 0;
              margin-top: 2px;
            }

            .action-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 4px;

              .action-description {
                font-size: 14px;
                color: var(--mat-sys-on-surface);
              }

              .action-due {
                font-size: 12px;
                color: var(--mat-sys-on-surface-variant);
              }
            }

            &.priority-high {
              border-left: 3px solid #f44336;

              mat-icon {
                color: #f44336;
              }
            }

            &.priority-medium {
              border-left: 3px solid #ff9800;

              mat-icon {
                color: #ff9800;
              }
            }

            &.priority-low {
              border-left: 3px solid #4caf50;

              mat-icon {
                color: #4caf50;
              }
            }
          }
        }
      }
    }
  `]
})
export class ProjectsPipelineWidgetComponent implements OnInit {
  activeProjects = signal<Project[]>([]);
  tips = signal<Tip[]>([]);

  ngOnInit(): void {
    // Mock active projects
    this.activeProjects.set([
      {
        id: '1',
        name: 'Kitchen Renovation',
        customer: 'Andersson Family',
        progress: 65,
        status: 'on-track',
        dueDate: 'Nov 15, 2025',
        actionItems: [
          {
            type: 'material',
            description: 'Order custom cabinet doors',
            priority: 'high',
            dueDate: 'Nov 7, 2025'
          },
          {
            type: 'inspection',
            description: 'Schedule electrical inspection',
            priority: 'medium',
            dueDate: 'Nov 10, 2025'
          }
        ]
      },
      {
        id: '2',
        name: 'Deck Construction',
        customer: 'Bergström Villa',
        progress: 35,
        status: 'at-risk',
        dueDate: 'Nov 20, 2025',
        actionItems: [
          {
            type: 'material',
            description: 'Treated lumber delivery delayed - follow up with supplier',
            priority: 'high'
          },
          {
            type: 'invoice',
            description: 'Send progress invoice (50% milestone)',
            priority: 'high',
            dueDate: 'Nov 8, 2025'
          }
        ]
      },
      {
        id: '3',
        name: 'Bathroom Remodel',
        customer: 'Carlsson Apartment',
        progress: 85,
        status: 'on-track',
        dueDate: 'Nov 10, 2025',
        actionItems: [
          {
            type: 'invoice',
            description: 'Prepare final invoice',
            priority: 'medium',
            dueDate: 'Nov 12, 2025'
          }
        ]
      }
    ]);

    // Generate smart tips
    this.generateTips();
  }

  private generateTips(): void {
    const tips: Tip[] = [];

    // Check for scheduling overlaps
    tips.push({
      type: 'warning',
      message: 'Deck Construction and Kitchen Renovation have overlapping schedules next week. Consider crew allocation.'
    });

    // Check for overdue invoices
    const overdueInvoices = this.activeProjects().some(p => 
      p.actionItems.some(a => a.type === 'invoice' && a.priority === 'high')
    );
    
    if (overdueInvoices) {
      tips.push({
        type: 'info',
        message: '2 invoices pending. Send reminders to improve cash flow.'
      });
    }

    this.tips.set(tips);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'on-track': return 'On Track';
      case 'at-risk': return 'At Risk';
      case 'delayed': return 'Delayed';
      default: return status;
    }
  }

  getTipIcon(type: string): string {
    switch (type) {
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  }

  getActionIcon(type: string): string {
    switch (type) {
      case 'material': return 'inventory_2';
      case 'invoice': return 'receipt';
      case 'permit': return 'verified';
      case 'inspection': return 'fact_check';
      default: return 'task';
    }
  }
}
