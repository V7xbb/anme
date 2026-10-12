import { getSql } from "@/lib/db";
import { dbSource } from "@/lib/db";
import {
  FORMATS,
  STATUSES,
  animeSelect,
  asStringList,
  clampBatch,
  rateLimit,
  safeHttpAsset,
  slugify,
  validateExternalUrl,
  validatePlaybackUrl,
} from "./domain";
import { audit, findDuplicates, mapAnime, randomUUID, readSettings, syncFromAnilist, touchProfile } from "./repo.server";

const FIELDS = animeSelect();

async function roleOf(userId: string): Promise<string> {
  const sql = await getSql();
  const rows = await sql.query<{ role: string }>("select role from profiles where id = $1", [userId]);
  return rows[0]?.role ?? "user";
}

async function assertNotSuspended(userId: string) {
  if ((await roleOf(userId)) === "suspended") throw new Error("Account suspended");
}

function tri(value: unknown): boolean | null {
  if (value === true || value === "yes") return true;
  if (value === false || value === "no") return false;
  return null;
}

function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function profileFor(userId: string) {
  const sql = await getSql();
  const user = await sql.query<{ name: string; email: string; image: string | null }>(
    `select name, email, image from "user" where id = $1`,
    [userId],
  );
  return touchProfile(userId, user[0]?.name ?? null, user[0]?.email ?? null, user[0]?.image ?? null);
}

export async function claimPreviewAdmin(userId: string) {
  if (dbSource !== "pglite") {
    throw new Error("Production admin access is granted only through KARTIFY_ADMIN_EMAILS.");
  }
  await profileFor(userId);
  if ((await roleOf(userId)) === "suspended") throw new Error("Account suspended");
  const sql = await getSql();
  await sql.query("update profiles set role = 'admin', updated_at = now() where id = $1", [userId]);
  await audit(userId, "claim_preview_admin", "profile", userId);
  return profileFor(userId);
}

export async function updateProfile(
  userId: string,
  input: { displayName?: string; avatarUrl?: string; locale?: string },
) {
  await assertNotSuspended(userId);
  await profileFor(userId);
  const name = cleanText(input.displayName, 80);
  const avatar = input.avatarUrl?.trim() ? safeHttpAsset(input.avatarUrl.trim()) : null;
  if (input.avatarUrl?.trim() && !avatar) throw new Error("Avatar URL must be a public https link.");
  const locale = input.locale === "en" ? "en" : "ar";
  const sql = await getSql();
  await sql.query(
    `update profiles set display_name = $2, avatar_url = $3, preferred_locale = $4, updated_at = now() where id = $1`,
    [userId, name, avatar, locale],
  );
  return profileFor(userId);
}

async function libraryRows(userId: string) {
  const sql = await getSql();
  const [favorites, watchlist, progress, settings] = await Promise.all([
    sql.query(`select ${FIELDS} from anime a join favorites f on f.anime_id = a.id where f.user_id = $1 order by f.created_at desc`, [userId]),
    sql.query(`select ${FIELDS} from anime a join watchlist w on w.anime_id = a.id where w.user_id = $1 order by w.created_at desc`, [userId]),
    sql.query(
      `select wp.progress_seconds, wp.completed, wp.updated_at, e.id as episode_id, e.episode_number, e.title as episode_title,
              a.slug, a.title, a.title_ar, a.poster_url, a.english_title, a.id as anime_id
       from watch_progress wp
       join episodes e on e.id = wp.episode_id
       join anime a on a.id = e.anime_id
       where wp.user_id = $1
       order by wp.updated_at desc
       limit 30`,
      [userId],
    ),
    readSettings(sql),
  ]);
  return {
    favorites: favorites.map((row) => mapAnime(row)),
    watchlist: watchlist.map((row) => mapAnime(row)),
    continueWatching: settings.continueWatchingEnabled
      ? progress
          .filter((row) => !row.completed)
          .map((row) => ({
            episodeId: String(row.episode_id),
            episodeNumber: Number(row.episode_number),
            episodeTitle: row.episode_title == null ? null : String(row.episode_title),
            progressSeconds: Number(row.progress_seconds ?? 0),
            slug: String(row.slug),
            title: String(row.title),
            titleAr: row.title_ar == null ? null : String(row.title_ar),
            posterUrl: safeHttpAsset(row.poster_url == null ? null : String(row.poster_url)),
            englishTitle: row.english_title == null ? null : String(row.english_title),
            updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at ?? ""),
          }))
      : [],
    favoritesIds: favorites.map((row) => String(row.id)),
    watchlistIds: watchlist.map((row) => String(row.id)),
  };
}

export async function loadLibrary(userId: string) {
  await assertNotSuspended(userId);
  await profileFor(userId);
  return libraryRows(userId);
}

export async function membership(userId: string) {
  await profileFor(userId);
  const sql = await getSql();
  const [favorites, watchlist] = await Promise.all([
    sql.query<{ anime_id: string }>("select anime_id from favorites where user_id = $1", [userId]),
    sql.query<{ anime_id: string }>("select anime_id from watchlist where user_id = $1", [userId]),
  ]);
  return {
    favoriteIds: favorites.map((row) => row.anime_id),
    watchlistIds: watchlist.map((row) => row.anime_id),
  };
}

async function toggle(table: "favorites" | "watchlist", userId: string, animeId: string) {
  await assertNotSuspended(userId);
  const sql = await getSql();
  const exists = await sql.query("select 1 as ok from anime where id = $1", [animeId]);
  if (!exists.length) throw new Error("Anime was not found.");
  const current = await sql.query(`select 1 as ok from ${table} where user_id = $1 and anime_id = $2`, [userId, animeId]);
  if (current.length) {
    await sql.query(`delete from ${table} where user_id = $1 and anime_id = $2`, [userId, animeId]);
    return false;
  }
  await sql.query(`insert into ${table} (user_id, anime_id) values ($1, $2) on conflict do nothing`, [userId, animeId]);
  return true;
}

export function toggleFavorite(userId: string, animeId: string) {
  return toggle("favorites", userId, animeId);
}

export function toggleWatchlist(userId: string, animeId: string) {
  return toggle("watchlist", userId, animeId);
}

export async function saveProgress(userId: string, episodeId: string, seconds: number, completed: boolean) {
  await assertNotSuspended(userId);
  const sql = await getSql();
  const episode = await sql.query("select id from episodes where id = $1", [episodeId]);
  if (!episode.length) throw new Error("Episode was not found.");
  const progress = Math.max(0, Math.min(72_000, Math.floor(seconds)));
  await sql.query(
    `insert into watch_progress (user_id, episode_id, progress_seconds, completed, updated_at)
     values ($1, $2, $3, $4, now())
     on conflict (user_id, episode_id) do update set
       progress_seconds = excluded.progress_seconds,
       completed = excluded.completed,
       updated_at = now()`,
    [userId, episodeId, progress, completed],
  );
  return { progressSeconds: progress, completed };
}

export async function progressFor(userId: string, episodeId: string) {
  const sql = await getSql();
  const rows = await sql.query<{ progress_seconds: number; completed: boolean }>(
    "select progress_seconds, completed from watch_progress where user_id = $1 and episode_id = $2",
    [userId, episodeId],
  );
  if (!rows[0]) return null;
  return { progressSeconds: Number(rows[0].progress_seconds), completed: Boolean(rows[0].completed) };
}

export async function recommendations(userId: string) {
  const sql = await getSql();
  const settings = await readSettings(sql);
  if (!settings.recommendationsEnabled) return [];
  const favs = await sql.query<{ id: string; genres: unknown }>(
    `select a.id, a.genres from anime a join favorites f on f.anime_id = a.id where f.user_id = $1`,
    [userId],
  );
  const genres = [...new Set(favs.flatMap((row) => asStringList(row.genres)))].slice(0, 8);
  if (!genres.length) {
    const popular = await sql.query(`select ${FIELDS} from anime order by popularity desc nulls last limit 12`);
    return popular.map((row) => mapAnime(row));
  }
  const ids = favs.map((row) => row.id);
  const items = await sql.query(
    `select ${FIELDS} from anime where genres && $1::text[] and not (id = any($2::text[])) order by rating desc nulls last, popularity desc nulls last limit 12`,
    [genres, ids],
  );
  return items.map((row) => mapAnime(row));
}

export async function submitContact(input: { name: string; email: string; message: string }) {
  if (!rateLimit("contact", 8, 60_000)) throw new Error("Too many messages. Try again shortly.");
  const name = cleanText(input.name, 80);
  const email = cleanText(input.email, 120);
  const message = cleanText(input.message, 2000);
  if (name.length < 2 || message.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a name, a valid email, and a message.");
  }
  const sql = await getSql();
  await sql.query("insert into contact_messages (id, name, email, message) values ($1, $2, $3, $4)", [
    randomUUID(),
    name,
    email,
    message,
  ]);
  return { ok: true };
}

function normalizeDomains(value: unknown): string[] {
  const raw = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  const domains = raw
    .split(/[\s,]+/)
    .map((item) => item.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/\.$/, ""))
    .filter((item) => /^[a-z0-9.-]+$/.test(item) && !item.includes("..") && item.length < 120);
  return [...new Set(domains)].slice(0, 40);
}

export async function saveSettings(
  adminId: string,
  input: {
    brandNameAr: string;
    brandNameEn: string;
    taglineAr: string;
    taglineEn: string;
    defaultLocale: string;
    syncBatchSize: number;
    allowedDomains: string;
    recommendationsEnabled: boolean;
    continueWatchingEnabled: boolean;
    bilingualEnabled: boolean;
  },
) {
  const sql = await getSql();
  const domains = normalizeDomains(input.allowedDomains);
  await sql.query(
    `update app_settings set
      brand_name_ar = $1, brand_name_en = $2, tagline_ar = $3, tagline_en = $4,
      default_locale = $5, sync_batch_size = $6, allowed_domains = $7::text[],
      recommendations_enabled = $8, continue_watching_enabled = $9, bilingual_enabled = $10,
      updated_at = now()
     where id = 1`,
    [
      cleanText(input.brandNameAr, 80) || "كارتيفاي أنمي",
      cleanText(input.brandNameEn, 80) || "KARTIFY ANIME",
      cleanText(input.taglineAr, 140),
      cleanText(input.taglineEn, 140),
      input.defaultLocale === "en" ? "en" : "ar",
      clampBatch(input.syncBatchSize),
      domains,
      Boolean(input.recommendationsEnabled),
      Boolean(input.continueWatchingEnabled),
      Boolean(input.bilingualEnabled),
    ],
  );
  await audit(adminId, "update_settings", "settings", "1", domains.join(","));
  return readSettings(sql);
}

export async function listUsers() {
  const sql = await getSql();
  const rows = await sql.query<{
    id: string;
    name: string;
    email: string;
    created_at: unknown;
    role: string | null;
    display_name: string | null;
  }>(
    `select u.id, u.name, u.email, u."createdAt" as created_at, p.role, p.display_name
     from "user" u left join profiles p on p.id = u.id
     order by u."createdAt" desc limit 100`,
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at ?? ""),
    role: row.role ?? "user",
    displayName: row.display_name,
  }));
}

export async function setUserRole(adminId: string, userId: string, role: string) {
  if (!["user", "admin", "suspended"].includes(role)) throw new Error("Unknown role.");
  if (adminId === userId && role !== "admin") throw new Error("You cannot remove your own admin access.");
  const sql = await getSql();
  await sql.query(
    `insert into profiles (id, display_name, role) values ($1, '', $2)
     on conflict (id) do update set role = excluded.role, updated_at = now()`,
    [userId, role],
  );
  await audit(adminId, "set_role", "profile", userId, role);
  return { ok: true };
}

export async function saveAnime(adminId: string, input: Record<string, unknown>) {
  const sql = await getSql();
  const title = cleanText(input.title, 180);
  if (title.length < 1) throw new Error("Title is required.");
  const format = FORMATS.includes(String(input.format) as (typeof FORMATS)[number]) ? String(input.format) : null;
  const status = STATUSES.includes(String(input.airingStatus) as (typeof STATUSES)[number]) ? String(input.airingStatus) : null;
  const year = Number(input.releaseYear);
  const episodes = Number(input.episodeCount);
  const seasonYear = Number(input.seasonYear);
  const genres = cleanText(input.genres, 240)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
  const poster = cleanText(input.posterUrl, 500);
  const banner = cleanText(input.bannerUrl, 500);
  if (poster && !safeHttpAsset(poster)) throw new Error("Poster URL must be public https.");
  if (banner && !safeHttpAsset(banner)) throw new Error("Banner URL must be public https.");
  const id = cleanText(input.id, 80);
  if (!id) {
    const providerId = randomUUID();
    const newId = randomUUID();
    await sql.query(
      `insert into anime (
        id, provider, provider_id, slug, title, title_ar, original_title, english_title, synopsis, synopsis_ar,
        synopsis_origin, poster_url, banner_url, poster_locked, genres, format, release_year, episode_count,
        airing_status, season, season_year, data_origin, has_arabic_subs, has_arabic_dub, has_egyptian_dub, metadata_language
      ) values (
        $1, 'admin', $2, $3, $4, $5, $6, $7, $8, $9,
        'admin', $10, $11, true, $12::text[], $13, $14, $15,
        $16, $17, $18, 'admin', $19, $20, $21, 'ar'
      )`,
      [
        newId,
        providerId,
        slugify(title, providerId.slice(0, 8)),
        title,
        cleanText(input.titleAr, 180) || null,
        cleanText(input.originalTitle, 180) || null,
        cleanText(input.englishTitle, 180) || null,
        cleanText(input.synopsis, 4000) || null,
        cleanText(input.synopsisAr, 4000) || null,
        poster || null,
        banner || null,
        genres,
        format,
        Number.isFinite(year) ? year : null,
        Number.isFinite(episodes) ? episodes : null,
        status,
        cleanText(input.season, 20) || null,
        Number.isFinite(seasonYear) ? seasonYear : null,
        tri(input.hasArabicSubs),
        tri(input.hasArabicDub),
        tri(input.hasEgyptianDub),
      ],
    );
    await audit(adminId, "create_anime", "anime", newId, title);
    return { id: newId };
  }
  const lockSynopsis = input.lockSynopsis === true;
  await sql.query(
    `update anime set
      title = $2,
      title_ar = $3,
      original_title = $4,
      english_title = $5,
      synopsis = case when $6::boolean then $7 else synopsis end,
      synopsis_ar = $8,
      synopsis_origin = case when $6::boolean then 'admin' else synopsis_origin end,
      poster_url = case when $9::boolean then $10 else poster_url end,
      banner_url = case when $9::boolean then $11 else banner_url end,
      poster_locked = poster_locked or $9::boolean,
      genres = $12::text[],
      format = $13,
      release_year = $14,
      episode_count = $15,
      airing_status = $16,
      season = $17,
      season_year = $18,
      has_arabic_subs = $19,
      has_arabic_dub = $20,
      has_egyptian_dub = $21,
      updated_at = now()
     where id = $1`,
    [
      id,
      title,
      cleanText(input.titleAr, 180) || null,
      cleanText(input.originalTitle, 180) || null,
      cleanText(input.englishTitle, 180) || null,
      lockSynopsis,
      cleanText(input.synopsis, 4000) || null,
      cleanText(input.synopsisAr, 4000) || null,
      input.lockPoster === true,
      poster || null,
      banner || null,
      genres,
      format,
      Number.isFinite(year) ? year : null,
      Number.isFinite(episodes) ? episodes : null,
      status,
      cleanText(input.season, 20) || null,
      Number.isFinite(seasonYear) ? seasonYear : null,
      tri(input.hasArabicSubs),
      tri(input.hasArabicDub),
      tri(input.hasEgyptianDub),
    ],
  );
  await audit(adminId, "update_anime", "anime", id, title);
  return { id };
}

export async function deleteAnime(adminId: string, id: string) {
  const sql = await getSql();
  await sql.query("delete from anime where id = $1", [id]);
  await audit(adminId, "delete_anime", "anime", id);
  return { ok: true };
}

export async function adminAnimePage(q: string) {
  const sql = await getSql();
  const pattern = `%${q.trim().replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
  const items = q.trim()
    ? await sql.query(
        `select ${FIELDS} from anime where title ilike $1 escape '\\' or coalesce(english_title,'') ilike $1 escape '\\' or provider_id ilike $1 escape '\\' order by updated_at desc limit 40`,
        [pattern],
      )
    : await sql.query(`select ${FIELDS} from anime order by updated_at desc limit 40`);
  return { items: items.map((row) => mapAnime(row)), duplicates: await findDuplicates() };
}

export async function adminEpisodes(animeId: string) {
  const sql = await getSql();
  const episodes = await sql.query(
    `select id, episode_number, title, synopsis, thumbnail_url, duration_seconds, season_id, origin
     from episodes where anime_id = $1 order by episode_number`,
    [animeId],
  );
  const seasons = await sql.query(
    "select id, season_number, title from seasons where anime_id = $1 order by season_number",
    [animeId],
  );
  return {
    seasons: seasons.map((row) => ({ id: String(row.id), number: Number(row.season_number), title: row.title == null ? null : String(row.title) })),
    episodes: episodes.map((row) => ({
      id: String(row.id),
      number: Number(row.episode_number),
      title: row.title == null ? null : String(row.title),
      synopsis: row.synopsis == null ? null : String(row.synopsis),
      thumbnailUrl: row.thumbnail_url == null ? null : String(row.thumbnail_url),
      durationSeconds: row.duration_seconds == null ? null : Number(row.duration_seconds),
      seasonId: row.season_id == null ? null : String(row.season_id),
      origin: String(row.origin),
    })),
  };
}

export async function saveEpisode(adminId: string, input: Record<string, unknown>) {
  const animeId = cleanText(input.animeId, 80);
  const number = Math.floor(Number(input.number));
  if (!animeId || !Number.isFinite(number) || number < 1 || number > 5000) throw new Error("Episode number is invalid.");
  const thumb = cleanText(input.thumbnailUrl, 500);
  if (thumb && !safeHttpAsset(thumb)) throw new Error("Thumbnail must be public https.");
  const duration = Number(input.durationSeconds);
  const sql = await getSql();
  const seasonId = cleanText(input.seasonId, 80) || null;
  const id = cleanText(input.id, 80) || randomUUID();
  await sql.query(
    `insert into episodes (id, anime_id, season_id, episode_number, title, synopsis, thumbnail_url, duration_seconds, origin)
     values ($1, $2, $3, $4, $5, $6, $7, $8, 'admin')
     on conflict (anime_id, episode_number) do update set
       title = excluded.title,
       synopsis = excluded.synopsis,
       thumbnail_url = excluded.thumbnail_url,
       duration_seconds = excluded.duration_seconds,
       season_id = excluded.season_id,
       origin = 'admin'`,
    [
      id,
      animeId,
      seasonId,
      number,
      cleanText(input.title, 180) || null,
      cleanText(input.synopsis, 4000) || null,
      thumb || null,
      Number.isFinite(duration) ? Math.floor(duration) : null,
    ],
  );
  await audit(adminId, "save_episode", "episode", animeId, String(number));
  return { ok: true };
}

export async function deleteEpisode(adminId: string, id: string) {
  const sql = await getSql();
  await sql.query("delete from episodes where id = $1", [id]);
  await audit(adminId, "delete_episode", "episode", id);
  return { ok: true };
}

export async function adminSources(episodeId: string) {
  const sql = await getSql();
  const rows = await sql.query(
    `select id, episode_id, provider_name, source_type, playback_url, language, subtitles_language, subtitle_url,
            is_official, authorization_verified, is_active
     from streaming_sources where episode_id = $1 order by created_at desc`,
    [episodeId],
  );
  return rows.map((row) => ({
    id: String(row.id),
    episodeId: String(row.episode_id),
    providerName: String(row.provider_name),
    sourceType: String(row.source_type),
    playbackUrl: String(row.playback_url),
    language: row.language == null ? "" : String(row.language),
    subtitlesLanguage: row.subtitles_language == null ? "" : String(row.subtitles_language),
    subtitleUrl: row.subtitle_url == null ? "" : String(row.subtitle_url),
    isOfficial: Boolean(row.is_official),
    authorizationVerified: Boolean(row.authorization_verified),
    isActive: Boolean(row.is_active),
  }));
}

export async function saveSource(adminId: string, input: Record<string, unknown>) {
  if (input.authorizationConfirmed !== true) {
    throw new Error("Confirm that this source is authorized before saving it.");
  }
  const episodeId = cleanText(input.episodeId, 80);
  const type = input.sourceType === "hls" || input.sourceType === "external" ? input.sourceType : "mp4";
  const sql = await getSql();
  const settings = await readSettings(sql);
  const rawUrl = cleanText(input.playbackUrl, 800);
  const verdict =
    type === "external" ? validateExternalUrl(rawUrl) : validatePlaybackUrl(rawUrl, settings.allowedDomains);
  if (!verdict.ok) {
    throw new Error(
      verdict.reason === "no-allowlist"
        ? "Add the host to allowed playback domains in settings first."
        : `Playback URL rejected (${verdict.reason}).`,
    );
  }
  if (type === "external" && settings.allowedDomains.length && !validatePlaybackUrl(rawUrl, settings.allowedDomains).ok) {
    throw new Error("External sources must use a domain from the allow-list.");
  }
  const subtitle = cleanText(input.subtitleUrl, 800);
  const subtitleVerdict = subtitle ? validatePlaybackUrl(subtitle, settings.allowedDomains) : null;
  if (subtitle && (!subtitleVerdict || !subtitleVerdict.ok)) throw new Error("Subtitle URL is not on the allow-list.");
  const id = cleanText(input.id, 80);
  const params = [
    episodeId,
    cleanText(input.providerName, 80) || "Source",
    type,
    verdict.href,
    cleanText(input.language, 16) || null,
    cleanText(input.subtitlesLanguage, 16) || null,
    subtitleVerdict && subtitleVerdict.ok ? subtitleVerdict.href : null,
    input.isOfficial === true,
    true,
    input.isActive !== false,
  ];
  if (id) {
    await sql.query(
      `update streaming_sources set provider_name = $2, source_type = $3, playback_url = $4, language = $5,
        subtitles_language = $6, subtitle_url = $7, is_official = $8, authorization_verified = $9, is_active = $10, updated_at = now()
       where id = $1 and episode_id = $11`,
      [id, ...params.slice(1), episodeId],
    );
  } else {
    await sql.query(
      `insert into streaming_sources (
        id, episode_id, provider_name, source_type, playback_url, language, subtitles_language, subtitle_url,
        is_official, authorization_verified, is_active
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [randomUUID(), ...params],
    );
  }
  await audit(adminId, "save_source", "streaming_source", episodeId, verdict.hostname);
  return { ok: true };
}

export async function deleteSource(adminId: string, id: string) {
  const sql = await getSql();
  await sql.query("delete from streaming_sources where id = $1", [id]);
  await audit(adminId, "delete_source", "streaming_source", id);
  return { ok: true };
}

export async function runSync(adminId: string, input: { kind: string; search?: string; page?: number; id?: number }) {
  const kind = ["trending", "season", "search", "id", "movies", "popular"].includes(input.kind)
    ? (input.kind as "trending" | "season" | "search" | "id" | "movies" | "popular")
    : "trending";
  const report = await syncFromAnilist({
    kind,
    search: input.search,
    page: input.page,
    id: input.id,
    markTrending: kind === "trending",
  });
  await audit(adminId, "sync", "anime", kind, report.message);
  return report;
}
