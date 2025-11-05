export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  position: number;
  visible: boolean;
  data?: any;
}

export interface DashboardLayout {
  businessType: string;
  widgets: WidgetConfig[];
}
