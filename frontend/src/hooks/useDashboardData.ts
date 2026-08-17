import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { DashboardResponse, Filters } from '../api/types';

export function useDashboardData(dashboardId: string, filters: Filters) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getDashboard(dashboardId, filters)
      .then((res) => {
        if (!cancelled) setData(res);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId, JSON.stringify(filters)]);

  return { data, loading, error };
}
