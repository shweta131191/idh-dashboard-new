import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { dashboardsRouter } from './routes/dashboards';
import { indicatorsRouter } from './routes/indicators';
import { filtersRouter } from './routes/filters';
import { geoSummaryRouter } from './routes/geoSummary';

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', dataMode: env.dataMode });
});

app.use('/api/dashboards', dashboardsRouter);
app.use('/api/indicators', indicatorsRouter);
app.use('/api/filters', filtersRouter);
app.use('/api/geo-summary', geoSummaryRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});
