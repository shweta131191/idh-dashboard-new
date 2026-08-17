import fs from 'node:fs';
import path from 'node:path';
import type { Registry } from '../types/indicator';

// shared/indicators.json lives at the monorepo root: dashboard/shared/indicators.json.
// This path is stable whether running from src (tsx) or dist (tsc build), since both
// preserve the same folder depth under backend/.
const REGISTRY_PATH = path.join(__dirname, '..', '..', '..', 'shared', 'indicators.json');

const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
export const registry: Registry = JSON.parse(raw);

export function getDashboards() {
  return registry.dashboards;
}

export function getIndicatorsForDashboard(dashboardId: string) {
  return registry.indicators.filter((i) => i.dashboard === dashboardId);
}

export function getIndicatorById(id: string) {
  return registry.indicators.find((i) => i.id === id);
}
