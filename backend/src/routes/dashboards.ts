import { Router } from 'express';
import { getDashboards, getIndicatorsForDashboard } from '../data/registry';
import { getIndicatorResult } from '../services/queryRunner';
import type { Filters } from '../types/indicator';

export const dashboardsRouter = Router();

function parseFilters(query: Record<string, unknown>): Filters {
  return {
    stateId: typeof query.stateId === 'string' ? query.stateId : undefined,
    districtId: typeof query.districtId === 'string' ? query.districtId : undefined,
    blockId: typeof query.blockId === 'string' ? query.blockId : undefined,
    dateFrom: typeof query.dateFrom === 'string' ? query.dateFrom : undefined,
    dateTo: typeof query.dateTo === 'string' ? query.dateTo : undefined,
  };
}

// GET /api/dashboards — list of dashboards for the sidebar
dashboardsRouter.get('/', (_req, res) => {
  res.json(getDashboards());
});

// GET /api/dashboards/:id?stateId=&districtId=&blockId=&dateFrom=&dateTo=
// Returns every indicator (grouped by sub-dashboard) with its computed result.
dashboardsRouter.get('/:id', async (req, res, next) => {
  try {
    const indicators = getIndicatorsForDashboard(req.params.id);
    if (indicators.length === 0) {
      res.status(404).json({ error: `Unknown dashboard "${req.params.id}"` });
      return;
    }
    const filters = parseFilters(req.query as Record<string, unknown>);

    const withResults = await Promise.all(
      indicators.map(async (ind) => ({
        id: ind.id,
        indicator: ind.indicator,
        subDashboard: ind.subDashboard,
        chartType: ind.chartType,
        chartLib: ind.chartLib,
        logic: ind.logic,
        notes: ind.notes,
        result: await getIndicatorResult(ind, filters),
      }))
    );

    const subDashboards = new Map<string, typeof withResults>();
    for (const item of withResults) {
      const list = subDashboards.get(item.subDashboard) ?? [];
      list.push(item);
      subDashboards.set(item.subDashboard, list);
    }

    res.json({
      dashboard: req.params.id,
      subDashboards: Array.from(subDashboards.entries()).map(([name, items]) => ({ name, indicators: items })),
    });
  } catch (err) {
    next(err);
  }
});
