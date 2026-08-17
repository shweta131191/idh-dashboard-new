import { env } from '../config/env';
import { getMockResult } from './mockData';
import { runLive } from './liveQuery';
import type { Filters, Indicator, IndicatorResult } from '../types/indicator';

export async function getIndicatorResult(ind: Indicator, filters: Filters): Promise<IndicatorResult> {
  if (env.dataMode === 'live') {
    return runLive(ind, filters);
  }
  return getMockResult(ind, filters);
}
