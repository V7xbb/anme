/** Pure catalog, metadata, and playback rules. No database or network. */

export const PROVIDER_ANILIST = "anilist";
export const PAGE_SIZE = 24;
export const MAX_SYNC_BATCH = 25;

export const OFFICIAL_STREAM_HOSTS = [
  "crunchyroll.com",
  "netflix.com",
  "primevideo.com",
  "amazon.com",
  "hidive.com",
  "disneyplus.com",
  "youtube.com",
  "youtu.be",
  "bilibili.tv",
  "iqiyi.com",
  "iq.com",
  "funimation.com",
  "hulu.com",
  "max.com",
];

export const FORMATS = ["TV", "MOVIE", "OVA", "ONA", "SPECIAL", "MUSIC"] as const;
export const STATUSES = [
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS",
] as const;
export const SORTS = ["rating", "popular", "year", "title", "updated"] as const;
export const AUDIO_FILTERS = ["", "ar-sub", "ar-dub", "eg-dub"] as const;

export type SortKey = (typeof SORTS)[number];
export type AudioFilter = (typeof AUDIO_FILTERS)[number];

export type CatalogInput = {
  q: string;
  genre: string;
  year: number | null;
  format: string;
  status: string;
  sort: SortKey;
  page: number;
  audio: AudioFilter;
  pageSize?: number;
};

export type RelatedRef = {
  providerId: string;
  relation: string;
  title: string;
  format: string | null;
};

export type ParsedExternalLink = {
  site: string;
  url: string;
  isPublic: boolean;
};

export type ParsedStreamingEpisode = {
  episodeNumber: number;
  title: string | null;
  thumbnailUrl: string | null;
  site: string | null;
  url: string | null;
  linkIsPublic: boolean;
};

export type ParsedMedia = {
  provider: string;
  providerId: string;
  slug: string;
  title: string;
  originalTitle: string | null;
  englishTitle: string | null;
  synopsis: string | null;
  posterUrl: string | null;
  bannerUrl: string | null;
  genres: string[];
  format: string | null;
  releaseYear: number | null;
  episodeCount: number | null;
  episodeDurationMinutes: number | null;
  airingStatus: string | null;
  season: string | null;
  seasonYear: number | null;
  rating: number | null;
  ratingSource: string | null;
  popularity: number | null;
  mainStudio: string | null;
  metadataLanguage: string;
  related: RelatedRef[];
  providerUpdatedAt: string | null;
  externalLinks: ParsedExternalLink[];
  streamingEpisodes: ParsedStreamingEpisode[];
};

const SORT_SQL: Record<SortKey, string> = {
  rating: "rating desc nulls last, popularity desc nulls last",
  popular: "popularity desc nulls last, rating desc nulls last",
  year: "release_year desc nulls last, title asc",
  title: "title asc",
  updated: "provider_updated_at desc nulls last, updated_at desc",
};

const ANIME_SELECT = `id, provider, provider_id, slug, title, title_ar, original_title, english_title,
  synopsis, synopsis_ar, synopsis_origin, poster_url, banner_url, genres, format, release_year,
  episode_count, episode_duration_minutes, airing_status, season, season_year, rating, rating_source,
  popularity, main_studio, metadata_language, data_origin, trending, has_arabic_subs, has_arabic_dub,
  has_egyptian_dub, related, provider_updated_at, last_synced_at`;

export function animeSelect(alias = ""): string {
  const prefix = alias ? `${alias}.` : "";
  return ANIME_SELECT.split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((column) => `${prefix}${column}`)
    .join(", ");
}

export function stripHtml(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/"/g, '"')
    .replace(/&#0?39;|'/g, "'")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function slugify(input: string, providerId: string): string {
  const base = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  const id = providerId.replace(/[^a-z0-9]+/gi, "").slice(0, 24) || "title";
  return `${base || "anime"}-${id}`;
}

export function dedupeKey(provider: string, providerId: string): string {
  return `${provider.trim().toLowerCase()}:${providerId.trim()}`;
}

export function likePattern(q: string): string {
  const esc = q.replace(/[\\%_]/g, (m) => `\\${m}`);
  return `%${esc}%`;
}

export function currentSeason(date = new Date()): { season: string; year: number } {
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  if (month <= 3) return { season: "WINTER", year };
  if (month <= 6) return { season: "SPRING", year };
  if (month <= 9) return { season: "SUMMER", year };
  return { season: "FALL", year };
}

export function clampPage(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(500, Math.floor(n));
}

export function clampBatch(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return 20;
  return Math.min(MAX_SYNC_BATCH, Math.floor(n));
}

export function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  }
  if (typeof value === "string") {
    const inner = value.replace(/^\{|\}$/g, "").trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((part) => part.trim().replace(/^"(.*)"$/, "$1"))
      .filter(Boolean);
  }
  return [];
}

export function hostAllowed(hostname: string, domains: readonly string[]): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
  return domains.some((domain) => {
    const normalized = domain.toLowerCase().replace(/^\*\./, "").replace(/\.$/, "");
    if (!normalized) return false;
    return host === normalized || host.endsWith(`.${normalized}`);
  });
}

function isPrivateIp(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return true;
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) {
    if (host === "::1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
      return true;
    }
    return false;
  }
  const parts = ipv4.slice(1).map(Number);
  if (parts.some((part) => part > 255)) return true;
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

export type UrlVerdict =
  | { ok: true; href: string; hostname: string }
  | { ok: false; reason: string };

/** Playback URLs must be HTTPS, public, and on the admin allow-list. Never fetched server-side. */
export function validatePlaybackUrl(raw: string, allowedDomains: readonly string[]): UrlVerdict {
  const trimmed = raw.trim();
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "https-only" };
  if (url.username || url.password) return { ok: false, reason: "credentials" };
  if (isPrivateIp(url.hostname)) return { ok: false, reason: "private-host" };
  if (allowedDomains.length === 0) return { ok: false, reason: "no-allowlist" };
  if (!hostAllowed(url.hostname, allowedDomains)) return { ok: false, reason: "domain" };
  return { ok: true, href: url.toString(), hostname: url.hostname.toLowerCase() };
}

/** Outbound watch links are not proxied. They still cannot target private hosts. */
export function validateExternalUrl(raw: string): UrlVerdict {
  const trimmed = raw.trim();
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "https-only" };
  if (url.username || url.password) return { ok: false, reason: "credentials" };
  if (isPrivateIp(url.hostname)) return { ok: false, reason: "private-host" };
  return { ok: true, href: url.toString(), hostname: url.hostname.toLowerCase() };
}

export function parseEpisodeNumber(title: string | null | undefined, index: number): number {
  if (title) {
    const match =
      title.match(/episode\s+(\d+)/i) ||
      title.match(/\bep\.?\s*(\d+)/i) ||
      title.match(/#\s*(\d+)/) ||
      title.match(/第\s*(\d+)\s*話/);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n > 0 && n < 10000) return n;
    }
  }
  return index + 1;
}

function str(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function num(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

export function parseAnilistMedia(raw: unknown): ParsedMedia | null {
  if (!raw || typeof raw !== "object") return null;
  const media = raw as Record<string, unknown>;
  const id = num(media.id);
  if (id == null) return null;
  const titleObj =
    media.title && typeof media.title === "object" ? (media.title as Record<string, unknown>) : {};
  const romaji = str(titleObj.romaji);
  const english = str(titleObj.english);
  const native = str(titleObj.native);
  const title = romaji || english || native;
  if (!title) return null;
  const cover =
    media.coverImage && typeof media.coverImage === "object"
      ? (media.coverImage as Record<string, unknown>)
      : {};
  const start =
    media.startDate && typeof media.startDate === "object"
      ? (media.startDate as Record<string, unknown>)
      : {};
  const studios =
    media.studios && typeof media.studios === "object"
      ? (media.studios as Record<string, unknown>)
      : {};
  const studioNodes = Array.isArray(studios.nodes) ? studios.nodes : [];
  const mainStudio =
    studioNodes
      .map((node) => (node && typeof node === "object" ? str((node as Record<string, unknown>).name) : null))
      .find(Boolean) ?? null;
  const synopsis = stripHtml(str(media.description)) || null;
  const updated = num(media.updatedAt);
  const relations =
    media.relations && typeof media.relations === "object"
      ? (media.relations as Record<string, unknown>)
      : {};
  const related: RelatedRef[] = [];
  if (Array.isArray(relations.edges)) {
    for (const edge of relations.edges) {
      if (!edge || typeof edge !== "object") continue;
      const edgeObj = edge as Record<string, unknown>;
      const node = edgeObj.node;
      if (!node || typeof node !== "object") continue;
      const nodeObj = node as Record<string, unknown>;
      if (nodeObj.type !== "ANIME") continue;
      const relatedId = num(nodeObj.id);
      const relatedTitleObj =
        nodeObj.title && typeof nodeObj.title === "object"
          ? (nodeObj.title as Record<string, unknown>)
          : {};
      const relatedTitle = str(relatedTitleObj.romaji) || str(relatedTitleObj.english) || str(relatedTitleObj.native);
      if (relatedId == null || !relatedTitle) continue;
      related.push({
        providerId: String(relatedId),
        relation: str(edgeObj.relationType) ?? "OTHER",
        title: relatedTitle,
        format: str(nodeObj.format),
      });
    }
  }

  const externalLinks: ParsedExternalLink[] = [];
  if (Array.isArray(media.externalLinks)) {
    for (const link of media.externalLinks) {
      if (!link || typeof link !== "object") continue;
      const item = link as Record<string, unknown>;
      if (item.type !== "STREAMING") continue;
      const verdict = typeof item.url === "string" ? validateExternalUrl(item.url) : { ok: false as const, reason: "invalid" };
      if (!verdict.ok) continue;
      externalLinks.push({
        site: str(item.site) ?? verdict.hostname,
        url: verdict.href,
        isPublic: hostAllowed(verdict.hostname, OFFICIAL_STREAM_HOSTS),
      });
    }
  }

  const streamingEpisodes: ParsedStreamingEpisode[] = [];
  const seenNumbers = new Set<number>();
  if (Array.isArray(media.streamingEpisodes)) {
    media.streamingEpisodes.forEach((episode, index) => {
      if (!episode || typeof episode !== "object") return;
      const item = episode as Record<string, unknown>;
      const titleText = str(item.title);
      let episodeNumber = parseEpisodeNumber(titleText, index);
      while (seenNumbers.has(episodeNumber)) episodeNumber += 1;
      seenNumbers.add(episodeNumber);
      const rawUrl = str(item.url);
      const verdict = rawUrl ? validateExternalUrl(rawUrl) : null;
      const thumb = str(item.thumbnail);
      streamingEpisodes.push({
        episodeNumber,
        title: titleText,
        thumbnailUrl: thumb && validateExternalUrl(thumb).ok ? thumb : null,
        site: str(item.site),
        url: verdict && verdict.ok ? verdict.href : null,
        linkIsPublic: Boolean(verdict && verdict.ok && hostAllowed(verdict.hostname, OFFICIAL_STREAM_HOSTS)),
      });
    });
  }

  const rating = num(media.averageScore);
  return {
    provider: PROVIDER_ANILIST,
    providerId: String(id),
    slug: slugify(english || romaji || title, String(id)),
    title,
    originalTitle: native,
    englishTitle: english,
    synopsis,
    posterUrl: str(cover.extraLarge) || str(cover.large) || null,
    bannerUrl: str(media.bannerImage),
    genres: asStringList(media.genres).slice(0, 20),
    format: str(media.format),
    releaseYear: num(start.year),
    episodeCount: num(media.episodes),
    episodeDurationMinutes: num(media.duration),
    airingStatus: str(media.status),
    season: str(media.season),
    seasonYear: num(media.seasonYear),
    rating: rating == null ? null : Math.max(0, Math.min(100, Math.round(rating))),
    ratingSource: rating == null ? null : "anilist",
    popularity: num(media.popularity),
    mainStudio,
    metadataLanguage: "en",
    related: related.slice(0, 24),
    providerUpdatedAt: updated == null ? null : new Date(updated * 1000).toISOString(),
    externalLinks,
    streamingEpisodes,
  };
}

export function emptyCatalogInput(): CatalogInput {
  return {
    q: "",
    genre: "",
    year: null,
    format: "",
    status: "",
    sort: "popular",
    page: 1,
    audio: "",
  };
}

export function normalizeCatalogInput(input: Partial<CatalogInput> | null | undefined): CatalogInput {
  const base = emptyCatalogInput();
  if (!input) return base;
  const sort = SORTS.includes(input.sort as SortKey) ? (input.sort as SortKey) : base.sort;
  const audio = AUDIO_FILTERS.includes(input.audio as AudioFilter) ? (input.audio as AudioFilter) : "";
  const format = input.format && FORMATS.includes(input.format as (typeof FORMATS)[number]) ? input.format : "";
  const status = input.status && STATUSES.includes(input.status as (typeof STATUSES)[number]) ? input.status : "";
  const yearNumber = input.year == null ? null : Number(input.year);
  const year = yearNumber != null && Number.isFinite(yearNumber) && yearNumber >= 1960 && yearNumber <= 2100
    ? Math.floor(yearNumber)
    : null;
  return {
    q: (input.q ?? "").trim().slice(0, 80),
    genre: (input.genre ?? "").trim().slice(0, 40),
    year,
    format,
    status,
    sort,
    page: clampPage(input.page ?? 1),
    audio,
    pageSize: clampBatch(input.pageSize ?? PAGE_SIZE) === 0 ? PAGE_SIZE : Math.min(PAGE_SIZE, Math.max(1, input.pageSize ?? PAGE_SIZE)),
  };
}

export function catalogSql(input: CatalogInput, mode: "rows" | "count"): { text: string; params: unknown[] } {
  const params: unknown[] = [];
  const where = ["true"];
  const add = (value: unknown) => {
    params.push(value);
    return `$${params.length}`;
  };
  if (input.q) {
    const pattern = add(likePattern(input.q));
    where.push(
      `(title ilike ${pattern} escape '\\' or coalesce(english_title, '') ilike ${pattern} escape '\\' or coalesce(original_title, '') ilike ${pattern} escape '\\' or coalesce(title_ar, '') ilike ${pattern} escape '\\')`,
    );
  }
  if (input.genre) where.push(`${add(input.genre)} = any(genres)`);
  if (input.year) where.push(`release_year = ${add(input.year)}`);
  if (input.format) where.push(`format = ${add(input.format)}`);
  if (input.status) where.push(`airing_status = ${add(input.status)}`);
  if (input.audio === "ar-sub") where.push("has_arabic_subs is true");
  if (input.audio === "ar-dub") where.push("has_arabic_dub is true");
  if (input.audio === "eg-dub") where.push("has_egyptian_dub is true");
  const clause = where.join(" and ");
  if (mode === "count") {
    return { text: `select count(*)::int as total from anime where ${clause}`, params };
  }
  const pageSize = input.pageSize ?? PAGE_SIZE;
  const limit = add(pageSize);
  const offset = add((input.page - 1) * pageSize);
  return {
    text: `select ${ANIME_SELECT} from anime where ${clause} order by ${SORT_SQL[input.sort]}, id asc limit ${limit} offset ${offset}`,
    params,
  };
}

export function isEmptyHome(data: {
  trending: unknown[];
  popular: unknown[];
  topRated: unknown[];
  recent: unknown[];
  season: unknown[];
  movies: unknown[];
}): boolean {
  return (
    data.trending.length +
      data.popular.length +
      data.topRated.length +
      data.recent.length +
      data.season.length +
      data.movies.length ===
    0
  );
}

export function scoreLabel(rating: number | null): string | null {
  if (rating == null) return null;
  return (rating / 10).toFixed(1);
}

export function safeHttpAsset(url: string | null | undefined): string | null {
  if (!url) return null;
  const verdict = validateExternalUrl(url);
  return verdict.ok ? verdict.href : null;
}

const hits = new Map<string, { n: number; t: number }>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const current = hits.get(key);
  if (!current || now - current.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return true;
  }
  if (current.n >= limit) return false;
  current.n += 1;
  return true;
}

export function resetRateLimits(): void {
  hits.clear();
}
