export interface TvShow {
  id: number;
  name: string;
  language?: string;
  rating?: { average?: number | null };
  image?: { medium?: string; original?: string };
  genres?: string[];
  summary?: string | null;
}
const BASE_URL = 'https://api.tvmaze.com/shows';

export async function fetchShows(): Promise<TvShow[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to load shows');
  return res.json();
}

export async function fetchShowById(id: number): Promise<TvShow> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Show not found');
  return res.json();
}
