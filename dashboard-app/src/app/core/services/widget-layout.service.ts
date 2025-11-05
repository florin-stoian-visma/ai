import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { WidgetConfig, DashboardLayout } from '../models/widget.model';
import { BusinessType } from '../models/business-type.model';

@Injectable({
  providedIn: 'root'
})
export class WidgetLayoutService {
  private readonly LAYOUT_KEY = 'dashboard_layout';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private layoutSubject = new BehaviorSubject<WidgetConfig[]>([]);
  public layout$: Observable<WidgetConfig[]> = this.layoutSubject.asObservable();

  private carpentryDefaultWidgets: WidgetConfig[] = [
    { id: 'financial-overview', type: 'financial-overview', title: 'Financial Overview', position: 0, visible: true },
    { id: 'today-overview', type: 'today-overview', title: 'Today Overview', position: 1, visible: true },
    { id: 'projects-pipeline', type: 'projects-pipeline', title: 'Projects Pipeline', position: 2, visible: true },
    { id: 'ai-assistant', type: 'ai-assistant', title: 'AI Assistant', position: 3, visible: true }
  ];

  private softwareConsultingDefaultWidgets: WidgetConfig[] = [
    { id: 'time-registration', type: 'time-registration', title: 'Time Registration', position: 0, visible: true },
    { id: 'ai-assistant', type: 'ai-assistant', title: 'AI Assistant', position: 1, visible: true }
  ];

  getDefaultLayout(businessType: BusinessType): WidgetConfig[] {
    switch (businessType) {
      case BusinessType.CARPENTRY:
        return [...this.carpentryDefaultWidgets];
      case BusinessType.SOFTWARE_CONSULTING:
        return [...this.softwareConsultingDefaultWidgets];
      default:
        return [];
    }
  }

  loadLayout(businessType: BusinessType): void {
    if (!this.isBrowser) {
      const defaultLayout = this.getDefaultLayout(businessType);
      this.layoutSubject.next(defaultLayout);
      return;
    }

    const stored = localStorage.getItem(this.LAYOUT_KEY);
    
    if (stored) {
      const layout: DashboardLayout = JSON.parse(stored);
      if (layout.businessType === businessType) {
        this.layoutSubject.next(layout.widgets);
        return;
      }
    }

    // Load default layout for business type
    const defaultLayout = this.getDefaultLayout(businessType);
    this.layoutSubject.next(defaultLayout);
    this.saveLayout(businessType, defaultLayout);
  }

  saveLayout(businessType: BusinessType, widgets: WidgetConfig[]): void {
    if (!this.isBrowser) {
      return;
    }
    
    const layout: DashboardLayout = {
      businessType,
      widgets
    };
    localStorage.setItem(this.LAYOUT_KEY, JSON.stringify(layout));
    this.layoutSubject.next(widgets);
  }

  updateWidgetPosition(widgetId: string, newPosition: number): void {
    const currentLayout = this.layoutSubject.value;
    const updatedLayout = currentLayout.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, position: newPosition };
      }
      return widget;
    }).sort((a, b) => a.position - b.position);

    this.layoutSubject.next(updatedLayout);
  }

  toggleWidgetVisibility(widgetId: string): void {
    const currentLayout = this.layoutSubject.value;
    const updatedLayout = currentLayout.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, visible: !widget.visible };
      }
      return widget;
    });

    this.layoutSubject.next(updatedLayout);
  }

  addWidget(widget: WidgetConfig): void {
    const currentLayout = this.layoutSubject.value;
    const maxPosition = currentLayout.reduce((max, w) => Math.max(max, w.position), -1);
    widget.position = maxPosition + 1;
    
    this.layoutSubject.next([...currentLayout, widget]);
  }

  removeWidget(widgetId: string): void {
    const currentLayout = this.layoutSubject.value;
    const updatedLayout = currentLayout.filter(widget => widget.id !== widgetId);
    
    this.layoutSubject.next(updatedLayout);
  }
}
