export type ChartType = 'kpi' | 'column' | 'pie' | 'donut';
export type ChartLib = 'none' | 'highcharts' | 'echarts';

export interface Category {
  label: string;
  value?: string;
  column?: string;
  table?: string;
  op?: string;
  min?: number | null;
  max?: number | null;
}

export interface DependsOn {
  column: string;
  value: string;
}

export interface Indicator {
  id: string;
  row: number;
  dashboard: string;
  subDashboard: string;
  indicator: string;
  chartType: ChartType;
  chartLib: ChartLib;
  tables: string[];
  aggregation: string;
  column?: string;
  columns?: string[];
  value?: string;
  scale?: number;
  scaleNote?: string;
  dependsOn?: DependsOn;
  categories?: Category[];
  multiSelect?: boolean;
  logic: string;
  sql: string;
  notes?: string;
  mock: { value?: number; series?: number[]; categoriesRuntime?: boolean };
}

export interface TableMeta {
  form: string;
  dateColumn: string;
  hasGeo: boolean;
}

export interface DashboardMeta {
  id: string;
  label: string;
}

export interface Registry {
  tables: Record<string, TableMeta>;
  dashboards: DashboardMeta[];
  indicators: Indicator[];
}

export interface Filters {
  stateId?: string;
  districtId?: string;
  blockId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type IndicatorResult =
  | { type: 'kpi'; value: number }
  | { type: 'series'; series: { label: string; value: number }[] };
