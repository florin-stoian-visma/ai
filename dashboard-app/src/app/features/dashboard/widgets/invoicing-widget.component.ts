import { Component, OnInit, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { WidgetContainerComponent } from '../../../shared/components/widget-container/widget-container.component';

interface CustomerInvoicing {
  customerId: string;
  customerName: string;
  uninvoicedHours: number;
  uninvoicedAmount: number;
  lastInvoiceDate?: string;
}

@Component({
  selector: 'app-invoicing-widget',
  imports: [
    CommonModule,
    FormsModule,
    WidgetContainerComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <app-widget-container title="Invoicing">
      <div class="invoicing-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Select Customer</mat-label>
          <mat-select [(ngModel)]="selectedCustomerId" (selectionChange)="onCustomerChange()">
            @for (customer of customers(); track customer.customerId) {
              <mat-option [value]="customer.customerId">{{ customer.customerName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        @if (selectedCustomer()) {
          <div class="invoice-summary">
            <div class="summary-card">
              <div class="summary-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="summary-content">
                <div class="summary-label">Uninvoiced Hours</div>
                <div class="summary-value">{{ selectedCustomer()!.uninvoicedHours }} h</div>
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-icon amount">
                <mat-icon>payments</mat-icon>
              </div>
              <div class="summary-content">
                <div class="summary-label">Uninvoiced Amount</div>
                <div class="summary-value amount">{{ selectedCustomer()!.uninvoicedAmount | currency:'SEK':'symbol':'1.0-0' }}</div>
              </div>
            </div>

            @if (selectedCustomer()!.lastInvoiceDate) {
              <div class="last-invoice">
                <mat-icon>history</mat-icon>
                <span>Last invoice: {{ selectedCustomer()!.lastInvoiceDate }}</span>
              </div>
            }

            <button 
              mat-raised-button 
              color="primary" 
              class="create-invoice-button"
              [disabled]="selectedCustomer()!.uninvoicedHours === 0"
              (click)="createInvoice()">
              <mat-icon>receipt_long</mat-icon>
              Create Invoice
            </button>

            @if (invoiceCreated()) {
              <div class="success-message">
                <mat-icon>check_circle</mat-icon>
                <span>Invoice created successfully!</span>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <mat-icon>receipt_long</mat-icon>
            <p>Select a customer to view uninvoiced hours</p>
          </div>
        }
      </div>
    </app-widget-container>
  `,
  styles: [`
    .invoicing-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .invoice-summary {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: var(--mat-sys-surface-container);
      border-radius: 8px;

      .summary-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
        display: flex;
        align-items: center;
        justify-content: center;

        &.amount {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      .summary-content {
        flex: 1;

        .summary-label {
          font-size: 13px;
          color: var(--mat-sys-on-surface-variant);
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: 500;
          color: var(--mat-sys-on-surface);

          &.amount {
            color: #2e7d32;
          }
        }
      }
    }

    .last-invoice {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background-color: var(--mat-sys-surface-container-low);
      border-radius: 6px;
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .create-invoice-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      margin-top: 8px;

      mat-icon {
        margin-right: 8px;
      }
    }

    .success-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background-color: #e8f5e9;
      border-left: 4px solid #4caf50;
      border-radius: 6px;
      color: #2e7d32;
      font-size: 14px;
      font-weight: 500;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #4caf50;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: var(--mat-sys-on-surface-variant);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      p {
        margin: 0;
        font-size: 14px;
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
export class InvoicingWidgetComponent implements OnInit {
  customers = signal<CustomerInvoicing[]>([]);
  selectedCustomerId = model('');
  selectedCustomer = signal<CustomerInvoicing | null>(null);
  invoiceCreated = signal(false);

  ngOnInit(): void {
    // Mock customer invoicing data
    this.customers.set([
      {
        customerId: '1',
        customerName: 'Tech Solutions AB',
        uninvoicedHours: 42.5,
        uninvoicedAmount: 63750,
        lastInvoiceDate: 'Oct 15, 2025'
      },
      {
        customerId: '2',
        customerName: 'Digital Konsult AB',
        uninvoicedHours: 28,
        uninvoicedAmount: 42000,
        lastInvoiceDate: 'Oct 20, 2025'
      },
      {
        customerId: '3',
        customerName: 'Nordic Systems',
        uninvoicedHours: 15.5,
        uninvoicedAmount: 23250,
        lastInvoiceDate: 'Oct 28, 2025'
      },
      {
        customerId: '4',
        customerName: 'Acme Corp',
        uninvoicedHours: 0,
        uninvoicedAmount: 0,
        lastInvoiceDate: 'Nov 1, 2025'
      }
    ]);
  }

  onCustomerChange(): void {
    const customer = this.customers().find(c => c.customerId === this.selectedCustomerId());
    this.selectedCustomer.set(customer || null);
    this.invoiceCreated.set(false);
  }

  createInvoice(): void {
    // Simulate invoice creation
    this.invoiceCreated.set(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      this.invoiceCreated.set(false);
    }, 3000);
  }
}
