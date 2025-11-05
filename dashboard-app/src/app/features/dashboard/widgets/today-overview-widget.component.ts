import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WidgetContainerComponent } from '../../../shared/components/widget-container/widget-container.component';

interface Job {
  id: string;
  customer: string;
  address: string;
  time: string;
  isOutdoor: boolean;
  tools: string[];
  materials: string[];
  commuteTime: string;
}

interface Weather {
  condition: string;
  temperature: number;
  warning?: string;
}

@Component({
  selector: 'app-today-overview-widget',
  imports: [CommonModule, WidgetContainerComponent, MatIconModule, MatChipsModule, MatTooltipModule],
  template: `
    <app-widget-container title="Today's Schedule">
      @if (weather().warning) {
        <div class="weather-warning">
          <mat-icon>warning</mat-icon>
          <span>{{ weather().warning }}</span>
        </div>
      }

      <div class="weather-info">
        <mat-icon>wb_sunny</mat-icon>
        <span>{{ weather().condition }}, {{ weather().temperature }}°C</span>
      </div>

      <div class="jobs-list">
        @for (job of todaysJobs(); track job.id) {
          <div class="job-card">
            <div class="job-header">
              <div class="job-time">
                <mat-icon>schedule</mat-icon>
                <span>{{ job.time }}</span>
              </div>
              @if (job.isOutdoor && weather().warning) {
                <mat-icon class="outdoor-warning" [matTooltip]="'Outdoor job - check weather'">warning_amber</mat-icon>
              }
            </div>

            <h4>{{ job.customer }}</h4>
            <div class="job-address">
              <mat-icon>location_on</mat-icon>
              <span>{{ job.address }}</span>
              <span class="commute-time">{{ job.commuteTime }}</span>
            </div>

            <div class="job-details">
              <div class="detail-section">
                <strong>Tools:</strong>
                <mat-chip-set>
                  @for (tool of job.tools; track tool) {
                    <mat-chip>{{ tool }}</mat-chip>
                  }
                </mat-chip-set>
              </div>

              <div class="detail-section">
                <strong>Materials:</strong>
                <mat-chip-set>
                  @for (material of job.materials; track material) {
                    <mat-chip>{{ material }}</mat-chip>
                  }
                </mat-chip-set>
              </div>
            </div>
          </div>
        }
      </div>
    </app-widget-container>
  `,
  styles: [`
    .weather-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      border-radius: 4px;
      margin-bottom: 16px;
      color: #e65100;

      mat-icon {
        color: #ff9800;
      }
    }

    .weather-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: var(--mat-sys-surface-container);
      border-radius: 8px;
      margin-bottom: 16px;
      color: var(--mat-sys-on-surface-variant);

      mat-icon {
        color: #ffa726;
      }
    }

    .jobs-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .job-card {
      padding: 16px;
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 8px;
      background-color: var(--mat-sys-surface-container-low);

      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .job-time {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--mat-sys-primary);
          font-weight: 500;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }

        .outdoor-warning {
          color: #ff9800;
        }
      }

      h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--mat-sys-on-surface);
      }

      .job-address {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 16px;
        font-size: 14px;
        color: var(--mat-sys-on-surface-variant);

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        .commute-time {
          margin-left: auto;
          padding: 2px 8px;
          background-color: var(--mat-sys-primary-container);
          color: var(--mat-sys-on-primary-container);
          border-radius: 12px;
          font-size: 12px;
        }
      }

      .job-details {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .detail-section {
          strong {
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            color: var(--mat-sys-on-surface-variant);
          }

          mat-chip-set {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }

          mat-chip {
            font-size: 12px;
          }
        }
      }
    }
  `]
})
export class TodayOverviewWidgetComponent implements OnInit {
  weather = signal<Weather>({
    condition: 'Partly Cloudy',
    temperature: 18,
    warning: 'Rain expected between 14:00-16:00'
  });

  todaysJobs = signal<Job[]>([]);

  ngOnInit(): void {
    // Mock today's jobs
    this.todaysJobs.set([
      {
        id: '1',
        customer: 'Andersson Residence',
        address: 'Kungsgatan 45, Stockholm',
        time: '09:00 - 12:00',
        isOutdoor: true,
        tools: ['Circular Saw', 'Drill', 'Level'],
        materials: ['Pine Boards 2x4', 'Screws', 'Wood Glue'],
        commuteTime: '25 min'
      },
      {
        id: '2',
        customer: 'Bergström Kitchen',
        address: 'Vasagatan 12, Stockholm',
        time: '13:00 - 17:00',
        isOutdoor: false,
        tools: ['Router', 'Miter Saw', 'Clamps'],
        materials: ['Oak Veneer', 'Cabinet Hinges', 'Finishing Nails'],
        commuteTime: '15 min'
      }
    ]);
  }
}
