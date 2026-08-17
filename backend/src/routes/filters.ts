import { Router } from 'express';
import { geography } from '../services/geography';

export const filtersRouter = Router();

// GET /api/filters/geography — state > district > block tree for the filter bar
filtersRouter.get('/geography', (_req, res) => {
  res.json(geography);
});
