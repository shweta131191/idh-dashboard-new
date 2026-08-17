import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { DashboardMeta } from '../api/types';

export function useDashboards() {
  const [dashboards, setDashboards] = useState<DashboardMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getDashboards()
      .then((data) => {
        if (!cancelled) setDashboards(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { dashboards, loading, error };
}
