import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { BusinessProfile, BusinessType } from '../../../core/models/business-type.model';
import { BusinessDetectionService } from '../../../core/services/business-detection.service';
import { WidgetLayoutService } from '../../../core/services/widget-layout.service';

@Component({
  selector: 'app-business-confirmation-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule
  ],
  template: `
    <div class="setup-container">
      <mat-card class="setup-card">
        <mat-card-header>
          <mat-card-title>Welcome! Confirm Your Business Type</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>We detected the following information from your Swedish organisation number:</p>
          
          <div class="info-section">
            <strong>Organisation Number:</strong> {{ detectedProfile?.organisationsnummer }}<br>
            <strong>Business Name:</strong> {{ detectedProfile?.businessName }}<br>
            <strong>Detected Type:</strong> {{ getBusinessTypeLabel(detectedProfile?.businessType!) }}
            @if (detectedProfile?.sniCode) {
              <br><strong>SNI Code:</strong> {{ detectedProfile?.sniCode }}
            }
          </div>

          <p class="confirmation-text">Is this information correct?</p>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Business Type</mat-label>
            <mat-select [(ngModel)]="selectedBusinessType">
              <mat-option [value]="BusinessType.CARPENTRY">
                {{ getBusinessTypeLabel(BusinessType.CARPENTRY) }}
              </mat-option>
              <mat-option [value]="BusinessType.SOFTWARE_CONSULTING">
                {{ getBusinessTypeLabel(BusinessType.SOFTWARE_CONSULTING) }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <p class="help-text">
            Your business type determines which widgets and features are displayed on your dashboard.
          </p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="confirm()">
            Confirm & Continue
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .setup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
    }

    .setup-card {
      max-width: 600px;
      width: 100%;
    }

    mat-card-title {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .info-section {
      background-color: var(--mat-sys-surface-container);
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }

    .confirmation-text {
      margin: 24px 0 16px 0;
      font-weight: 500;
    }

    .full-width {
      width: 100%;
    }

    .help-text {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 8px;
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
export class BusinessConfirmationDialogComponent implements OnInit {
  BusinessType = BusinessType;
  selectedBusinessType!: BusinessType;
  detectedProfile: BusinessProfile | null = null;

  constructor(
    private router: Router,
    private businessDetectionService: BusinessDetectionService,
    private widgetLayoutService: WidgetLayoutService
  ) {}

  ngOnInit(): void {
    // Simulate detecting business type from organisationsnummer
    const mockOrgNumber = '556789-1234'; // Default to carpentry for demo

    this.businessDetectionService.detectBusinessType(mockOrgNumber).subscribe({
      next: (profile) => {
        this.detectedProfile = profile;
        this.selectedBusinessType = profile.businessType;
      }
    });
  }

  getBusinessTypeLabel(type: BusinessType): string {
    switch (type) {
      case BusinessType.CARPENTRY:
        return 'Carpentry / Construction';
      case BusinessType.SOFTWARE_CONSULTING:
        return 'Software Consulting / IT Services';
      case BusinessType.UNKNOWN:
        return 'Unknown / Other';
      default:
        return type;
    }
  }

  confirm(): void {
    if (this.detectedProfile) {
      const confirmedProfile: BusinessProfile = {
        ...this.detectedProfile,
        businessType: this.selectedBusinessType,
        confirmed: true
      };
      
      this.businessDetectionService.saveBusinessProfile(confirmedProfile);
      this.widgetLayoutService.loadLayout(confirmedProfile.businessType);
      
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}
