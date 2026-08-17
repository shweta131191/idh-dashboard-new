import { Router } from 'express';
import { geoSummary } from '../services/geoSummary';

export const geoSummaryRouter = Router();

// GET /api/geo-summary — beneficiary/partner counts per state > district > block,
// consumed by the India map widget and merged over its static geoData.ts skeleton.
geoSummaryRouter.get('/', (_req, res) => {
  res.json(geoSummary);
});
