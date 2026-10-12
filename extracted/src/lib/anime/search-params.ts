export type CatalogSearch = {
  q: string;
  page: number;
  genre: string;
  year: string;
  format: string;
  status: string;
  sort: string;
  audio: string;
};

export const blankSearch: CatalogSearch = {
  q: "",
  page: 1,
  genre: "",
  year: "",
  format: "",
  status: "",
  sort: "popular",
  audio: "",
};

export function readCatalogSearch(search: Record<string, unknown>): CatalogSearch {
  const page = Number(search.page);
  return {
    q: typeof search.q === "string" ? search.q.slice(0, 80) : "",
    page: Number.isFinite(page) && page > 0 ? Math.min(500, Math.floor(page)) : 1,
    genre: typeof search.genre === "string" ? search.genre.slice(0, 40) : "",
    year: typeof search.year === "string" ? search.year.replace(/[^\d]/g, "").slice(0, 4) : "",
    format: typeof search.format === "string" ? search.format.slice(0, 16) : "",
    status: typeof search.status === "string" ? search.status.slice(0, 32) : "",
    sort: typeof search.sort === "string" ? search.sort.slice(0, 16) : "popular",
    audio: typeof search.audio === "string" ? search.audio.slice(0, 16) : "",
  };
}
