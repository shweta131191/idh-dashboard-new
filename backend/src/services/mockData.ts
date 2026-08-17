import type { Filters, Indicator, IndicatorResult } from '../types/indicator';

/**
 * Deterministic pseudo-variance so changing filters visibly changes the numbers in
 * mock mode (useful for demoing the filter wiring before a live DB is connected).
 * Same filters always produce the same scale factor; no filters => scale of 1.
 */
function filterScale(filters: Filters): number {
  const key = JSON.stringify([filters.stateId, filters.districtId, filters.blockId, filters.dateFrom, filters.dateTo]);
  if (key === JSON.stringify([undefined, undefined, undefined, undefined, undefined])) return 1;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  // Map hash to a 0.55–1.0 band — narrowing a filter should plausibly shrink the count.
  return 0.55 + (hash % 1000) / 1000 / 2.2;
}

export function getMockResult(ind: Indicator, filters: Filters): IndicatorResult {
  const scale = filterScale(filters);

  if (ind.mock.value !== undefined) {
    return { type: 'kpi', value: Math.round(ind.mock.value * scale) };
  }

  const series = ind.mock.series ?? [];
  const labels = ind.categories?.map((c) => c.label) ?? series.map((_, i) => `Series ${i + 1}`);

  return {
    type: 'series',
    series: series.map((v, i) => ({ label: labels[i] ?? `Series ${i + 1}`, value: Math.round(v * scale) })),
  };
}
