import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { GeographyResponse } from '../api/types';

export function useGeography() {
  const [geography, setGeography] = useState<GeographyResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getGeography().then((res) => {
      if (!cancelled) setGeography(res);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return geography;
}
