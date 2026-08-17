import { registry } from '../data/registry';
import type { Filters } from '../types/indicator';

/**
 * Builds the shared WHERE clause (isActive + geography + date range) for a table,
 * given the request's filters. Applied identically across every aggregation kind
 * so filtering behaves consistently for every indicator.
 */
export function buildWhere(table: string, filters: Filters): { clause: string; params: unknown[] } {
  const meta = registry.tables[table];
  const clauses = ["isActive = '1'"];
  const params: unknown[] = [];

  if (meta?.hasGeo) {
    if (filters.stateId) {
      clauses.push('state_id = ?');
      params.push(filters.stateId);
    }
    if (filters.districtId) {
      clauses.push('district_id = ?');
      params.push(filters.districtId);
    }
    if (filters.blockId) {
      clauses.push('block_id = ?');
      params.push(filters.blockId);
    }
  }

  if (meta?.dateColumn) {
    if (filters.dateFrom) {
      clauses.push(`${meta.dateColumn} >= ?`);
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      clauses.push(`${meta.dateColumn} <= ?`);
      params.push(filters.dateTo);
    }
  }

  return { clause: clauses.join(' AND '), params };
}
