import type { LiveGeoSummary } from '../data/geoData';
import type { DashboardMeta, DashboardResponse, Filters, GeographyResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function filtersToQuery(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.stateId) params.set('stateId', filters.stateId);
  if (filters.districtId) params.set('districtId', filters.districtId);
  if (filters.blockId) params.set('blockId', filters.blockId);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  getDashboards: () => get<DashboardMeta[]>('/api/dashboards'),
  getDashboard: (id: string, filters: Filters) => get<DashboardResponse>(`/api/dashboards/${id}${filtersToQuery(filters)}`),
  getGeography: () => get<GeographyResponse>('/api/filters/geography'),
  getGeoSummary: () => get<LiveGeoSummary>('/api/geo-summary'),
};
