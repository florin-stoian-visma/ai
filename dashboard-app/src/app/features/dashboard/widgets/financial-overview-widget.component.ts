import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WidgetContainerComponent } from '../../../shared/components/widget-container/widget-container.component';

interface FinancialData {
  cashFlow: number;
  profitability: number;
  forecast: number;
}

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-financial-overview-widget',
  imports: [CommonModule, WidgetContainerComponent, NgxChartsModule],
  template: `
    <app-widget-container title="Financial Overview">
      <div class="financial-summary">
        <div class="summary-card">
          <div class="label">Cash Flow</div>
          <div class="value positive">{{ data().cashFlow | currency:'SEK':'symbol':'1.0-0' }}</div>
        </div>
        <div class="summary-card">
          <div class="label">Profitability</div>
          <div class="value">{{ data().profitability }}%</div>
        </div>
        <div class="summary-card">
          <div class="label">30-Day Forecast</div>
          <div class="value positive">{{ data().forecast | currency:'SEK':'symbol':'1.0-0' }}</div>
        </div>
      </div>

      <div class="chart-container">
        <h4>Monthly Revenue</h4>
        <ngx-charts-line-chart
          [results]="revenueData()"
          [xAxis]="true"
          [yAxis]="true"
          [showXAxisLabel]="false"
          [showYAxisLabel]="false"
          [scheme]="colorScheme"
          [autoScale]="true">
        </ngx-charts-line-chart>
      </div>
    </app-widget-container>
  `,
  styles: [`
    .financial-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background-color: var(--mat-sys-surface-container);
      padding: 16px;
      border-radius: 8px;

      .label {
        font-size: 14px;
        color: var(--mat-sys-on-surface-variant);
        margin-bottom: 8px;
      }

      .value {
        font-size: 24px;
        font-weight: 500;
        color: var(--mat-sys-on-surface);

        &.positive {
          color: #2e7d32;
        }

        &.negative {
          color: #c62828;
        }
      }
    }

    .chart-container {
      max-height: 250px;

      h4 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--mat-sys-on-surface);
      }

      ngx-charts-line-chart {
        height: 200px;
      }
    }

    @media (max-width: 768px) {
      .financial-summary {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FinancialOverviewWidgetComponent implements OnInit {
  data = signal<FinancialData>({
    cashFlow: 325000,
    profitability: 23.5,
    forecast: 450000
  });

  revenueData = signal<any[]>([]);

  colorScheme: any = {
    domain: ['#7939b4', '#5d288c', '#9653ce']
  };

  ngOnInit(): void {
    // Mock revenue data for the chart
    this.revenueData.set([
      {
        name: 'Revenue',
        series: [
          { name: 'Jan', value: 280000 },
          { name: 'Feb', value: 310000 },
          { name: 'Mar', value: 295000 },
          { name: 'Apr', value: 340000 },
          { name: 'May', value: 325000 },
          { name: 'Jun', value: 360000 }
        ]
      }
    ]);
  }
}
