import { getPool } from '../config/db';
import { buildWhere } from './sqlBuilder';
import type { Filters, Indicator, IndicatorResult } from '../types/indicator';

/**
 * Executes an indicator's aggregation against the real MySQL database (DATA_MODE=live),
 * built from the registry metadata rather than parsing the free-text `sql` reference
 * string — that field is documentation; this is the parameterized query that runs.
 */
export async function runLive(ind: Indicator, filters: Filters): Promise<IndicatorResult> {
  const pool = getPool();
  const table = ind.tables[0];
  const { clause, params } = buildWhere(table, filters);

  switch (ind.aggregation) {
    case 'count': {
      const [rows] = await pool.query(`SELECT COUNT(*) AS value FROM ${table} WHERE ${clause}`, params);
      return { type: 'kpi', value: Number((rows as any)[0].value) };
    }

    case 'sum': {
      const [rows] = await pool.query(
        `SELECT SUM(${ind.column}) AS value FROM ${table} WHERE ${clause}`,
        params
      );
      return { type: 'kpi', value: Number((rows as any)[0].value ?? 0) };
    }

    case 'avg': {
      const [rows] = await pool.query(
        `SELECT AVG(${ind.column}) AS value FROM ${table} WHERE ${clause}`,
        params
      );
      return { type: 'kpi', value: Number((rows as any)[0].value ?? 0) };
    }

    case 'count_equals': {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS value FROM ${table} WHERE ${clause} AND ${ind.column} = ?`,
        [...params, ind.value]
      );
      return { type: 'kpi', value: Number((rows as any)[0].value) };
    }

    case 'count_not_null': {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS value FROM ${table} WHERE ${clause} AND ${ind.column} IS NOT NULL AND ${ind.column} <> ''`,
        params
      );
      return { type: 'kpi', value: Number((rows as any)[0].value) };
    }

    case 'multi_select_count_single': {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS value FROM ${table} WHERE ${clause} AND FIND_IN_SET(?, ${ind.column})`,
        [...params, ind.value]
      );
      return { type: 'kpi', value: Number((rows as any)[0].value) };
    }

    case 'count_any_yes': {
      const orClause = (ind.columns ?? []).map((c) => `${c} = '1'`).join(' OR ');
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS value FROM ${table} WHERE ${clause} AND (${orClause})`,
        params
      );
      return { type: 'kpi', value: Number((rows as any)[0].value) };
    }

    case 'sum_scaled': {
      const sumExpr = (ind.columns ?? []).join(' + ');
      const [rows] = await pool.query(
        `SELECT SUM(${sumExpr}) / ? AS value FROM ${table} WHERE ${clause}`,
        [...params, 1 / (ind.scale ?? 1)]
      );
      return { type: 'kpi', value: Number((rows as any)[0].value ?? 0) };
    }

    case 'count_distribution': {
      const depends = ind.dependsOn ? ` AND ${ind.dependsOn.column} = '${ind.dependsOn.value}'` : '';
      const [rows] = await pool.query(
        `SELECT ${ind.column} AS label, COUNT(*) AS value FROM ${table} WHERE ${clause}${depends} AND ${ind.column} IS NOT NULL AND ${ind.column} <> '' GROUP BY ${ind.column}`,
        params
      );
      return {
        type: 'series',
        series: (rows as any[]).map((r) => ({ label: String(r.label), value: Number(r.value) })),
      };
    }

    case 'multi_select_count': {
      const series = [];
      for (const cat of ind.categories ?? []) {
        const matchValue = cat.value ?? cat.label;
        const depends = ind.dependsOn ? ` AND ${ind.dependsOn.column} = '${ind.dependsOn.value}'` : '';
        const [rows] = await pool.query(
          `SELECT COUNT(*) AS value FROM ${table} WHERE ${clause}${depends} AND FIND_IN_SET(?, ${ind.column})`,
          [...params, matchValue]
        );
        series.push({ label: cat.label, value: Number((rows as any)[0].value) });
      }
      return { type: 'series', series };
    }

    case 'sum_compare': {
      const series = [];
      for (const cat of ind.categories ?? []) {
        const [rows] = await pool.query(
          `SELECT SUM(${cat.column}) AS value FROM ${table} WHERE ${clause}`,
          params
        );
        series.push({ label: cat.label, value: Number((rows as any)[0].value ?? 0) });
      }
      return { type: 'series', series };
    }

    case 'count_by_selection_count': {
      const [rows] = await pool.query(
        `SELECT (LENGTH(${ind.column}) - LENGTH(REPLACE(${ind.column}, ',', '')) + 1) AS n, COUNT(*) AS value FROM ${table} WHERE ${clause} AND ${ind.column} IS NOT NULL AND ${ind.column} <> '' GROUP BY n ORDER BY n`,
        params
      );
      const byN = new Map<number, number>((rows as any[]).map((r) => [Number(r.n), Number(r.value)]));
      const series = (ind.categories ?? []).map((cat, idx) => ({
        label: cat.label,
        value: byN.get(idx + 1) ?? 0,
      }));
      return { type: 'series', series };
    }

    case 'mixed_per_category': {
      const series = [];
      for (const cat of ind.categories ?? []) {
        const catTable = cat.table ?? table;
        const { clause: catClause, params: catParams } = buildWhere(catTable, filters);
        let value = 0;
        if (cat.op === 'count') {
          const [rows] = await pool.query(`SELECT COUNT(*) AS value FROM ${catTable} WHERE ${catClause}`, catParams);
          value = Number((rows as any)[0].value);
        } else if (cat.op === 'sum') {
          const [rows] = await pool.query(
            `SELECT SUM(${cat.column}) AS value FROM ${catTable} WHERE ${catClause}`,
            catParams
          );
          value = Number((rows as any)[0].value ?? 0);
        } else if (cat.op === 'count_not_null') {
          const [rows] = await pool.query(
            `SELECT COUNT(*) AS value FROM ${catTable} WHERE ${catClause} AND ${cat.column} IS NOT NULL AND ${cat.column} <> ''`,
            catParams
          );
          value = Number((rows as any)[0].value);
        } else if (cat.op === 'count_equals') {
          const [rows] = await pool.query(
            `SELECT COUNT(*) AS value FROM ${catTable} WHERE ${catClause} AND FIND_IN_SET(?, ${cat.column})`,
            [...catParams, cat.value]
          );
          value = Number((rows as any)[0].value);
        }
        series.push({ label: cat.label, value });
      }
      return { type: 'series', series };
    }

    default:
      throw new Error(`Unhandled aggregation kind "${ind.aggregation}" for indicator ${ind.id}`);
  }
}
