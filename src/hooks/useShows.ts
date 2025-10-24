import { useEffect, useMemo, useRef, useState } from 'react';
import { TvShow, fetchShows } from '../api/tvmaze';

// in-memory cache (Bonus: simple offline-like fallback during session)
let _cache: TvShow[] | null = null;
let _lastFetchedAt = 0;

export function useShows() {
  const [data, setData] = useState<TvShow[] | null>(_cache);
  const [loading, setLoading] = useState<boolean>(!_cache);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  async function load(force = false) {
    try {
      setError(null);
      if (!force && _cache && Date.now() - _lastFetchedAt < 5 * 60 * 1000) {
        setData(_cache);
        setLoading(false);
        return;
      }
      setLoading(true);
      const shows = await fetchShows();
      _cache = shows;
      _lastFetchedAt = Date.now();
      if (mounted.current) setData(shows);
    } catch (e: any) {
      if (mounted.current) setError(e?.message || 'Unknown error');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  useEffect(() => {
    mounted.current = true;
    if (!_cache) load();
    return () => { mounted.current = false; };
  }, []);

  return {
    data,
    loading,
    error,
    reload: () => load(true),
  };
}

export function useFilteredShows(list: TvShow[] | null, query: string) {
  return useMemo(() => {
    if (!list) return [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(s => s.name?.toLowerCase().includes(q));
  }, [list, query]);
}
