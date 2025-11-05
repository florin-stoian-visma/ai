import { Component, OnInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusinessDetectionService } from '../../core/services/business-detection.service';
import { WidgetLayoutService } from '../../core/services/widget-layout.service';
import { BusinessProfile, BusinessType } from '../../core/models/business-type.model';
import { WidgetConfig } from '../../core/models/widget.model';
import { BusinessConfirmationDialogComponent } from './business-confirmation-dialog/business-confirmation-dialog.component';
import { FinancialOverviewWidgetComponent } from './widgets/financial-overview-widget.component';
import { TodayOverviewWidgetComponent } from './widgets/today-overview-widget.component';
import { ProjectsPipelineWidgetComponent } from './widgets/projects-pipeline-widget.component';
import { AiAssistantWidgetComponent } from './widgets/ai-assistant-widget.component';
import { TimeRegistrationWidgetComponent } from './widgets/time-registration-widget.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FinancialOverviewWidgetComponent,
    TodayOverviewWidgetComponent,
    ProjectsPipelineWidgetComponent,
    AiAssistantWidgetComponent,
    TimeRegistrationWidgetComponent
  ],
  template: `
    <div class="dashboard-container">
      @if (loading()) {
        <div class="loading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading dashboard...</p>
        </div>
      } @else {
        <div class="dashboard-header">
          <h1>Dashboard</h1>
          <p class="business-info">
            {{ businessProfile()?.businessName }} 
            <span class="business-type-badge">{{ getBusinessTypeLabel(businessProfile()?.businessType!) }}</span>
          </p>
        </div>

        <div class="widget-grid">
          @for (widget of visibleWidgets(); track widget.id) {
            @switch (widget.type) {
              @case ('financial-overview') {
                <app-financial-overview-widget />
              }
              @case ('today-overview') {
                <app-today-overview-widget />
              }
              @case ('projects-pipeline') {
                <app-projects-pipeline-widget />
              }
              @case ('ai-assistant') {
                <app-ai-assistant-widget />
              }
              @case ('time-registration') {
                <app-time-registration-widget />
              }
              @default {
                <div class="widget-placeholder">
                  <h3>{{ widget.title }}</h3>
                  <p>Widget type "{{ widget.type }}" not implemented yet</p>
                </div>
              }
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100%;
    }
    
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      gap: 16px;
      
      p {
        color: var(--mat-sys-on-surface-variant);
      }
    }
    
    .dashboard-header {
      margin-bottom: 24px;
      
      h1 {
        margin: 0 0 8px 0;
        font-size: 32px;
        font-weight: 500;
        color: var(--mat-sys-on-surface);
      }
      
      .business-info {
        margin: 0;
        font-size: 16px;
        color: var(--mat-sys-on-surface-variant);
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .business-type-badge {
        background-color: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 500;
      }
    }

    .widget-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      grid-auto-flow: dense;

      app-today-overview-widget {
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      app-ai-assistant-widget {
        grid-column: 2;
        grid-row: 1;
      }

      app-financial-overview-widget {
        grid-column: 2;
        grid-row: 2;
        margin-top: -12px;
      }

      app-projects-pipeline-widget {
        grid-column: 1 / span 2;
        grid-row: 3;
      }

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        
        app-today-overview-widget,
        app-ai-assistant-widget,
        app-financial-overview-widget,
        app-projects-pipeline-widget {
          grid-column: 1;
          grid-row: auto;
        }

        app-financial-overview-widget {
          margin-top: 0;
        }
      }
    }

    .widget-placeholder {
      background-color: var(--mat-sys-surface-container-low);
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
      padding: 24px;
      min-height: 300px;
      
      h3 {
        margin: 0 0 12px 0;
        color: var(--mat-sys-on-surface);
      }
      
      p {
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  businessProfile = signal<BusinessProfile | null>(null);
  visibleWidgets = signal<WidgetConfig[]>([]);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    private businessDetectionService: BusinessDetectionService,
    private widgetLayoutService: WidgetLayoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeDashboard();
    } else {
      this.loading.set(false);
    }
  }

  private async initializeDashboard(): Promise<void> {
    const existingProfile = this.businessDetectionService.getBusinessProfile();

    if (existingProfile && existingProfile.confirmed) {
      // Load existing profile
      this.businessProfile.set(existingProfile);
      this.widgetLayoutService.loadLayout(existingProfile.businessType);
      this.loadWidgets();
      this.loading.set(false);
    } else {
      // Navigate to setup page for business confirmation
      this.router.navigate(['/setup']);
    }
  }

  private loadWidgets(): void {
    this.widgetLayoutService.layout$.subscribe(widgets => {
      this.visibleWidgets.set(widgets.filter(w => w.visible));
    });
  }

  getBusinessTypeLabel(type: BusinessType): string {
    switch (type) {
      case BusinessType.CARPENTRY:
        return 'Carpentry / Construction';
      case BusinessType.SOFTWARE_CONSULTING:
        return 'Software Consulting';
      default:
        return 'Unknown';
    }
  }
}
