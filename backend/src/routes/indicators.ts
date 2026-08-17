import { Router } from 'express';
import { getIndicatorById } from '../data/registry';
import { getIndicatorResult } from '../services/queryRunner';
import type { Filters } from '../types/indicator';

export const indicatorsRouter = Router();

// GET /api/indicators/:id?stateId=&districtId=&blockId=&dateFrom=&dateTo=
indicatorsRouter.get('/:id', async (req, res, next) => {
  try {
    const ind = getIndicatorById(req.params.id);
    if (!ind) {
      res.status(404).json({ error: `Unknown indicator "${req.params.id}"` });
      return;
    }
    const filters: Filters = {
      stateId: req.query.stateId as string | undefined,
      districtId: req.query.districtId as string | undefined,
      blockId: req.query.blockId as string | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
    };
    const result = await getIndicatorResult(ind, filters);
    res.json({
      id: ind.id,
      indicator: ind.indicator,
      chartType: ind.chartType,
      chartLib: ind.chartLib,
      logic: ind.logic,
      notes: ind.notes,
      result,
    });
  } catch (err) {
    next(err);
  }
});
