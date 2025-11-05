import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { BusinessProfile, BusinessType } from '../../../core/models/business-type.model';

@Component({
  selector: 'app-business-confirmation-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Confirm Your Business Type</h2>
    <mat-dialog-content>
      <p>We detected the following information from your Swedish organisation number:</p>
      
      <div class="info-section">
        <strong>Organisation Number:</strong> {{ data.organisationsnummer }}<br>
        <strong>Business Name:</strong> {{ data.businessName }}<br>
        <strong>Detected Type:</strong> {{ getBusinessTypeLabel(data.businessType) }}
        @if (data.sniCode) {
          <br><strong>SNI Code:</strong> {{ data.sniCode }}
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
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="confirm()">
        Confirm & Continue
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
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
  `]
})
export class BusinessConfirmationDialogComponent {
  BusinessType = BusinessType;
  selectedBusinessType!: BusinessType;

  constructor(
    public dialogRef: MatDialogRef<BusinessConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BusinessProfile
  ) {
    this.selectedBusinessType = data.businessType;
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
    const confirmedProfile: BusinessProfile = {
      ...this.data,
      businessType: this.selectedBusinessType
    };
    this.dialogRef.close(confirmedProfile);
  }
}
