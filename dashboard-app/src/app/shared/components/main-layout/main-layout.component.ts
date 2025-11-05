import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav mode="side" [opened]="sidenavOpened()" class="sidenav">
        <div class="sidebar-header">
          <h2>Spiris</h2>
        </div>
        
        <mat-nav-list>
          @for (item of navItems; track item.route) {
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="toolbar">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-spacer"></span>
          <span class="user-info">{{ userName() }}</span>
        </mat-toolbar>

        <div class="content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      background-color: var(--mat-sys-surface);
    }

    .sidenav {
      width: 260px;
      background: linear-gradient(180deg, #7939b4 0%, #5d288c 100%);
      color: white;
      border-right: none;
    }

    .sidenav-header {
      padding: 24px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      h2 {
        margin: 0;
        font-size: 28px;
        font-weight: 500;
        color: white;
      }
    }

    ::ng-deep .sidenav mat-nav-list {
      padding-top: 8px;

      .mat-mdc-list-item {
        color: rgba(255, 255, 255, 0.8);
        border-radius: 0;
        margin: 0;
        padding: 0 16px;
        height: 48px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
          color: white;
        }

        &.active-link {
          background-color: rgba(255, 255, 255, 0.12);
          color: white;
          border-left: 4px solid white;
          padding-left: 12px;
        }

        .mat-icon {
          color: inherit;
        }
      }
    }

    .toolbar {
      background-color: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .user-info {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
    }

    .content {
      padding: 24px;
      min-height: calc(100vh - 64px);
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 200px;
      }

      .content {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  sidenavOpened = signal(true);
  userName = signal('Hugo Walldnö');

  navItems: NavItem[] = [
    { label: 'Overview', icon: 'dashboard', route: '/dashboard' },
    { label: 'Customers', icon: 'people', route: '/customers' },
    { label: 'Checklists', icon: 'checklist', route: '/checklists' },
    { label: 'Contacts', icon: 'contacts', route: '/contacts' },
    { label: 'Time registration', icon: 'schedule', route: '/time-registration' },
    { label: 'Outlay registration', icon: 'receipt_long', route: '/outlay' },
    { label: 'Invoicing', icon: 'receipt', route: '/invoicing' },
    { label: 'Resource planning', icon: 'event', route: '/resources' },
    { label: 'Reports', icon: 'assessment', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  toggleSidenav(): void {
    this.sidenavOpened.update(value => !value);
  }
}
