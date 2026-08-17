export type ChartType = 'kpi' | 'column' | 'pie' | 'donut';
export type ChartLib = 'none' | 'highcharts' | 'echarts';

export type IndicatorResult =
  | { type: 'kpi'; value: number }
  | { type: 'series'; series: { label: string; value: number }[] };

export interface IndicatorWithResult {
  id: string;
  indicator: string;
  subDashboard: string;
  chartType: ChartType;
  chartLib: ChartLib;
  logic: string;
  notes?: string;
  result: IndicatorResult;
}

export interface DashboardResponse {
  dashboard: string;
  subDashboards: { name: string; indicators: IndicatorWithResult[] }[];
}

export interface DashboardMeta {
  id: string;
  label: string;
}

export interface GeoBlock {
  id: string;
  name: string;
}
export interface GeoDistrict {
  id: string;
  name: string;
  blocks: GeoBlock[];
}
export interface GeoState {
  id: string;
  name: string;
  districts: GeoDistrict[];
}
export interface GeographyResponse {
  states: GeoState[];
}

export interface Filters {
  stateId?: string;
  districtId?: string;
  blockId?: string;
  dateFrom?: string;
  dateTo?: string;
}
