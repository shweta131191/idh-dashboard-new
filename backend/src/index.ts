import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`IDH dashboard API listening on http://localhost:${env.port} (DATA_MODE=${env.dataMode})`);
});
