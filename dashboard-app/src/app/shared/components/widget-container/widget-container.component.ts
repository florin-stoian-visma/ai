import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-widget-container',
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="widget-card">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <ng-content />
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .widget-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      
      mat-card-header {
        padding-bottom: 16px;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
      
      mat-card-title {
        font-size: 20px;
        font-weight: 500;
        color: var(--mat-sys-on-surface);
      }
      
      mat-card-content {
        flex: 1;
        padding-top: 16px;
      }
    }
  `]
})
export class WidgetContainerComponent {
  @Input() title: string = '';
}
