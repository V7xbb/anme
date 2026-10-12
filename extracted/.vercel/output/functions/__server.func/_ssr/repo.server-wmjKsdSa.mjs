import { a as getSql, t as dbSource } from "./db-D23WWzhe.mjs";
import { c as catalogSql, d as dedupeKey, f as normalizeCatalogInput, h as safeHttpAsset, l as clampBatch, m as rateLimit, o as animeSelect, p as parseAnilistMedia, r as PROVIDER_ANILIST, s as asStringList, u as currentSeason, v as validateExternalUrl } from "./domain-C7YK6ubC.mjs";
import { randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/repo.server-wmjKsdSa.js
var ENDPOINT = "https://graphql.anilist.co";
var MEDIA_QUERY = `query (
  $page: Int, $perPage: Int, $sort: [MediaSort], $search: String,
  $season: MediaSeason, $seasonYear: Int, $format: MediaFormat, $id: Int
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { total currentPage lastPage hasNextPage }
    media(
      type: ANIME, isAdult: false, sort: $sort, search: $search,
      season: $season, seasonYear: $seasonYear, format: $format, id: $id
    ) {
      id
      title { romaji english native }
      description(asHtml: false)
      coverImage { extraLarge large }
      bannerImage
      genres
      format
      status
      season
      seasonYear
      episodes
      duration
      averageScore
      popularity
      updatedAt
      startDate { year }
      studios(isMain: true) { nodes { name } }
      externalLinks { site url type }
      streamingEpisodes { title thumbnail url site }
      relations { edges { relationType node { id type format title { romaji english native } } } }
    }
  }
}`;
function cleanVariables(input) {
	const out = {};
	for (const [key, value] of Object.entries(input)) {
		if (value == null || value === "") continue;
		out[key] = value;
	}
	out.page = input.page && input.page > 0 ? input.page : 1;
	out.perPage = clampBatch(input.perPage ?? 20);
	return out;
}
async function post(variables, attempt = 0) {
	const response = await fetch(ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			query: MEDIA_QUERY,
			variables: cleanVariables(variables)
		})
	});
	if (response.status === 429 && attempt < 2) {
		await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
		return post(variables, attempt + 1);
	}
	if (!response.ok) throw new Error(`AniList request failed (${response.status})`);
	const body = await response.json();
	if (body.errors?.length) throw new Error(body.errors[0]?.message || "AniList returned an error");
	return body.data;
}
async function fetchAnilistPage(variables) {
	const page = (await post(variables))?.Page;
	return {
		media: (Array.isArray(page?.media) ? page.media : []).map((item) => parseAnilistMedia(item)).filter((item) => item != null),
		pageInfo: {
			total: page?.pageInfo?.total ?? null,
			currentPage: page?.pageInfo?.currentPage ?? null,
			lastPage: page?.pageInfo?.lastPage ?? null,
			hasNextPage: Boolean(page?.pageInfo?.hasNextPage)
		}
	};
}
var FIELDS = animeSelect();
function iso(value) {
	if (value == null) return null;
	if (value instanceof Date) return value.toISOString();
	return String(value) || null;
}
function boolOrNull(value) {
	if (value == null) return null;
	return Boolean(value);
}
function mapAnime(row) {
	return {
		id: String(row.id),
		provider: String(row.provider),
		providerId: String(row.provider_id),
		slug: String(row.slug),
		title: String(row.title),
		titleAr: row.title_ar == null ? null : String(row.title_ar),
		originalTitle: row.original_title == null ? null : String(row.original_title),
		englishTitle: row.english_title == null ? null : String(row.english_title),
		synopsis: row.synopsis == null ? null : String(row.synopsis),
		synopsisAr: row.synopsis_ar == null ? null : String(row.synopsis_ar),
		synopsisOrigin: String(row.synopsis_origin ?? "provider"),
		posterUrl: safeHttpAsset(row.poster_url == null ? null : String(row.poster_url)),
		bannerUrl: safeHttpAsset(row.banner_url == null ? null : String(row.banner_url)),
		genres: asStringList(row.genres),
		format: row.format == null ? null : String(row.format),
		releaseYear: row.release_year == null ? null : Number(row.release_year),
		episodeCount: row.episode_count == null ? null : Number(row.episode_count),
		episodeDurationMinutes: row.episode_duration_minutes == null ? null : Number(row.episode_duration_minutes),
		airingStatus: row.airing_status == null ? null : String(row.airing_status),
		season: row.season == null ? null : String(row.season),
		seasonYear: row.season_year == null ? null : Number(row.season_year),
		rating: row.rating == null ? null : Number(row.rating),
		ratingSource: row.rating_source == null ? null : String(row.rating_source),
		popularity: row.popularity == null ? null : Number(row.popularity),
		mainStudio: row.main_studio == null ? null : String(row.main_studio),
		metadataLanguage: String(row.metadata_language ?? "en"),
		dataOrigin: String(row.data_origin ?? "provider"),
		trending: Boolean(row.trending),
		hasArabicSubs: boolOrNull(row.has_arabic_subs),
		hasArabicDub: boolOrNull(row.has_arabic_dub),
		hasEgyptianDub: boolOrNull(row.has_egyptian_dub),
		providerUpdatedAt: iso(row.provider_updated_at),
		lastSyncedAt: iso(row.last_synced_at)
	};
}
async function rowsOf(sql, text, params = []) {
	return (await sql.query(text, params)).map(mapAnime);
}
function mapSettings(row) {
	return {
		brandNameAr: String(row?.brand_name_ar ?? "كارتيفاي أنمي"),
		brandNameEn: String(row?.brand_name_en ?? "KARTIFY ANIME"),
		taglineAr: String(row?.tagline_ar ?? "عالمك، قصتك، أنميك."),
		taglineEn: String(row?.tagline_en ?? "Your world. Your story. Your anime."),
		defaultLocale: row?.default_locale === "en" ? "en" : "ar",
		syncBatchSize: clampBatch(row?.sync_batch_size ?? 20),
		allowedDomains: asStringList(row?.allowed_domains),
		recommendationsEnabled: row?.recommendations_enabled !== false,
		continueWatchingEnabled: row?.continue_watching_enabled !== false,
		bilingualEnabled: row?.bilingual_enabled !== false
	};
}
async function readSettings(sql) {
	return mapSettings((await sql.query("select * from app_settings where id = 1"))[0]);
}
var seeding = null;
async function upsertMedia(sql, media, markTrending) {
	const id = randomUUID();
	const related = JSON.stringify(media.related);
	const animeId = (await sql.query(`insert into anime (
      id, provider, provider_id, slug, title, original_title, english_title, synopsis, synopsis_origin,
      poster_url, banner_url, genres, format, release_year, episode_count, episode_duration_minutes,
      airing_status, season, season_year, rating, rating_source, popularity, main_studio,
      metadata_language, data_origin, trending, related, provider_updated_at, last_synced_at, updated_at
    ) values (
      $1, $2, $3, $4, $5, $6, $7, $8, 'provider',
      $9, $10, $11::text[], $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21, $22,
      $23, 'provider', $24, $25::jsonb, $26, now(), now()
    )
    on conflict (provider, provider_id) do update set
      title = excluded.title,
      original_title = excluded.original_title,
      english_title = excluded.english_title,
      synopsis = case when anime.synopsis_origin = 'admin' then anime.synopsis else excluded.synopsis end,
      poster_url = case when anime.poster_locked then anime.poster_url else excluded.poster_url end,
      banner_url = case when anime.poster_locked then anime.banner_url else excluded.banner_url end,
      genres = excluded.genres,
      format = excluded.format,
      release_year = excluded.release_year,
      episode_count = excluded.episode_count,
      episode_duration_minutes = excluded.episode_duration_minutes,
      airing_status = excluded.airing_status,
      season = excluded.season,
      season_year = excluded.season_year,
      rating = excluded.rating,
      rating_source = excluded.rating_source,
      popularity = excluded.popularity,
      main_studio = excluded.main_studio,
      related = excluded.related,
      provider_updated_at = excluded.provider_updated_at,
      trending = case when $24::boolean then true else anime.trending end,
      last_synced_at = now(),
      updated_at = now()
    returning id`, [
		id,
		media.provider,
		media.providerId,
		media.slug,
		media.title,
		media.originalTitle,
		media.englishTitle,
		media.synopsis,
		media.posterUrl,
		media.bannerUrl,
		media.genres,
		media.format,
		media.releaseYear,
		media.episodeCount,
		media.episodeDurationMinutes,
		media.airingStatus,
		media.season,
		media.seasonYear,
		media.rating,
		media.ratingSource,
		media.popularity,
		media.mainStudio,
		media.metadataLanguage,
		markTrending,
		related,
		media.providerUpdatedAt
	]))[0]?.id;
	if (!animeId) throw new Error("Failed to save anime");
	const seasonTitle = [media.season, media.seasonYear].filter(Boolean).join(" ") || "Season 1";
	const seasonId = (await sql.query(`insert into seasons (id, anime_id, season_number, title, origin)
     values ($1, $2, 1, $3, 'provider')
     on conflict (anime_id, season_number) do update set
       title = case when seasons.origin = 'admin' then seasons.title else excluded.title end
     returning id`, [
		randomUUID(),
		animeId,
		seasonTitle
	]))[0]?.id ?? null;
	for (const episode of media.streamingEpisodes) {
		const episodeRows = await sql.query(`insert into episodes (
        id, anime_id, season_id, episode_number, title, thumbnail_url, origin
      ) values ($1, $2, $3, $4, $5, $6, 'provider')
      on conflict (anime_id, episode_number) do update set
        title = case when episodes.origin = 'admin' then episodes.title else coalesce(excluded.title, episodes.title) end,
        thumbnail_url = case when episodes.origin = 'admin' then episodes.thumbnail_url else coalesce(excluded.thumbnail_url, episodes.thumbnail_url) end,
        season_id = coalesce(episodes.season_id, excluded.season_id)
      returning id`, [
			randomUUID(),
			animeId,
			seasonId,
			episode.episodeNumber,
			episode.title,
			episode.thumbnailUrl
		]);
		if (episode.url && episodeRows[0]?.id) await sql.query(`insert into external_watch_links (
          id, anime_id, episode_id, site, url, title, origin, confirmed_by_admin, is_public
        ) values ($1, $2, $3, $4, $5, $6, 'anilist', false, $7)
        on conflict (anime_id, url) do update set
          site = excluded.site,
          episode_id = coalesce(external_watch_links.episode_id, excluded.episode_id),
          is_public = case when external_watch_links.origin = 'admin' then external_watch_links.is_public else excluded.is_public end`, [
			randomUUID(),
			animeId,
			episodeRows[0].id,
			episode.site ?? "AniList",
			episode.url,
			episode.title,
			episode.linkIsPublic
		]);
	}
	for (const link of media.externalLinks) await sql.query(`insert into external_watch_links (
        id, anime_id, site, url, origin, confirmed_by_admin, is_public
      ) values ($1, $2, $3, $4, 'anilist', false, $5)
      on conflict (anime_id, url) do update set
        site = excluded.site,
        is_public = case when external_watch_links.origin = 'admin' then external_watch_links.is_public else excluded.is_public end`, [
		randomUUID(),
		animeId,
		link.site,
		link.url,
		link.isPublic
	]);
	return animeId;
}
async function recordSync(sql, kind, status, success, failure, message) {
	await sql.query(`insert into sync_runs (id, kind, status, success_count, failure_count, message, finished_at)
     values ($1, $2, $3, $4, $5, $6, now())`, [
		randomUUID(),
		kind,
		status,
		success,
		failure,
		message.slice(0, 500)
	]);
}
async function syncFromAnilist(input) {
	if (!rateLimit("anilist-sync", 6, 6e4)) return {
		ok: false,
		success: 0,
		failure: 0,
		message: "Sync is cooling down. Try again in a minute."
	};
	const sql = await getSql();
	const settings = await readSettings(sql);
	const season = currentSeason();
	const perPage = settings.syncBatchSize;
	const variables = input.kind === "id" ? {
		page: 1,
		perPage: 1,
		id: input.id
	} : input.kind === "search" ? {
		page: input.page ?? 1,
		perPage,
		search: input.search,
		sort: ["SEARCH_MATCH"]
	} : input.kind === "season" ? {
		page: input.page ?? 1,
		perPage,
		sort: ["POPULARITY_DESC"],
		season: season.season,
		seasonYear: season.year
	} : input.kind === "movies" ? {
		page: input.page ?? 1,
		perPage,
		sort: ["POPULARITY_DESC"],
		format: "MOVIE"
	} : input.kind === "popular" ? {
		page: input.page ?? 1,
		perPage,
		sort: ["POPULARITY_DESC"]
	} : {
		page: input.page ?? 1,
		perPage,
		sort: ["TRENDING_DESC"]
	};
	const markTrending = input.markTrending ?? input.kind === "trending";
	try {
		const page = await fetchAnilistPage(variables);
		if (markTrending) await sql.query("update anime set trending = false where trending = true");
		let success = 0;
		let failure = 0;
		const errors = [];
		for (const media of page.media) try {
			await upsertMedia(sql, media, markTrending);
			success += 1;
		} catch (error) {
			failure += 1;
			errors.push(`${dedupeKey(media.provider, media.providerId)}: ${error instanceof Error ? error.message : "save failed"}`);
		}
		const message = errors[0] ? `${success} saved, ${failure} failed. ${errors[0]}` : `${success} saved from AniList.`;
		await recordSync(sql, input.kind, failure && !success ? "failed" : "completed", success, failure, message);
		return {
			ok: failure === 0,
			success,
			failure,
			message
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "AniList sync failed";
		await recordSync(sql, input.kind, "failed", 0, 1, message);
		return {
			ok: false,
			success: 0,
			failure: 1,
			message
		};
	}
}
async function seedIfEmpty() {
	if (((await (await getSql()).query("select count(*)::int as total from anime"))[0]?.total ?? 0) > 0) return {
		ok: true,
		skipped: true,
		success: 0,
		failure: 0,
		message: "Catalog already stored."
	};
	const trending = await syncFromAnilist({
		kind: "trending",
		markTrending: true
	});
	const season = await syncFromAnilist({ kind: "season" });
	const movies = await syncFromAnilist({ kind: "movies" });
	const success = trending.success + season.success + movies.success;
	const failure = trending.failure + season.failure + movies.failure;
	const message = [
		trending.message,
		season.message,
		movies.message
	].filter(Boolean).join(" ");
	if (success === 0) throw new Error(message || "Could not reach AniList.");
	return {
		ok: failure === 0,
		success,
		failure,
		message
	};
}
function ensureSeeded() {
	seeding ??= seedIfEmpty().finally(() => {
		seeding = null;
	});
	return seeding;
}
async function loadHome() {
	try {
		await ensureSeeded();
	} catch (error) {
		if (((await (await getSql()).query("select count(*)::int as total from anime"))[0]?.total ?? 0) === 0) throw error;
	}
	const sql = await getSql();
	const season = currentSeason();
	const settings = await readSettings(sql);
	const [trending, popular, topRated, recent, seasonal, movies, genres, latestSync, totals] = await Promise.all([
		rowsOf(sql, `select ${FIELDS} from anime where trending = true order by popularity desc nulls last, rating desc nulls last limit 16`),
		rowsOf(sql, `select ${FIELDS} from anime order by popularity desc nulls last limit 16`),
		rowsOf(sql, `select ${FIELDS} from anime where rating is not null order by rating desc, popularity desc nulls last limit 16`),
		rowsOf(sql, `select ${FIELDS} from anime order by provider_updated_at desc nulls last limit 16`),
		rowsOf(sql, `select ${FIELDS} from anime where season = $1 and season_year = $2 order by popularity desc nulls last limit 16`, [season.season, season.year]),
		rowsOf(sql, `select ${FIELDS} from anime where format = 'MOVIE' order by popularity desc nulls last limit 16`),
		sql.query("select g.genre, count(*)::int as n from anime a cross join lateral unnest(a.genres) as g(genre) group by g.genre order by n desc, g.genre asc limit 18"),
		sql.query("select kind, status, success_count, failure_count, message, finished_at from sync_runs order by started_at desc limit 1"),
		sql.query("select count(*)::int as total from anime")
	]);
	const genreRails = [];
	for (const genre of genres.slice(0, 4)) {
		const items = await rowsOf(sql, `select ${FIELDS} from anime where $1 = any(genres) order by popularity desc nulls last limit 10`, [genre.genre]);
		if (items.length) genreRails.push({
			genre: genre.genre,
			items
		});
	}
	return {
		featured: [
			...trending,
			...seasonal,
			...popular,
			...topRated
		].find((item) => item.bannerUrl) ?? popular[0] ?? null,
		trending,
		popular,
		topRated,
		recent,
		seasonal,
		movies,
		genreRails,
		genres: genres.map((genre) => ({
			name: genre.genre,
			count: genre.n
		})),
		season,
		settings,
		total: totals[0]?.total ?? 0,
		sync: latestSync[0] ? {
			kind: String(latestSync[0].kind),
			status: String(latestSync[0].status),
			success: Number(latestSync[0].success_count ?? 0),
			failure: Number(latestSync[0].failure_count ?? 0),
			message: latestSync[0].message == null ? null : String(latestSync[0].message),
			finishedAt: iso(latestSync[0].finished_at)
		} : null
	};
}
async function loadCatalog(raw) {
	await ensureSeeded().catch(() => void 0);
	const input = normalizeCatalogInput(raw);
	const sql = await getSql();
	const list = catalogSql(input, "rows");
	const count = catalogSql(input, "count");
	const [items, totals, genres] = await Promise.all([
		rowsOf(sql, list.text, list.params),
		sql.query(count.text, count.params),
		sql.query("select g.genre, count(*)::int as n from anime a cross join lateral unnest(a.genres) as g(genre) group by g.genre order by n desc, g.genre asc limit 40")
	]);
	const total = totals[0]?.total ?? 0;
	return {
		items,
		total,
		page: input.page,
		pageSize: input.pageSize ?? 24,
		pages: Math.max(1, Math.ceil(total / (input.pageSize ?? 24))),
		genres: genres.map((genre) => genre.genre),
		applied: input
	};
}
async function loadAnime(slug) {
	const sql = await getSql();
	const anime = (await rowsOf(sql, `select ${FIELDS} from anime where slug = $1`, [slug]))[0];
	if (!anime) return null;
	const [seasons, episodes, links, relatedRow] = await Promise.all([
		sql.query("select id, season_number, title, synopsis, origin from seasons where anime_id = $1 order by season_number", [anime.id]),
		sql.query(`select e.id, e.episode_number, e.title, e.synopsis, e.thumbnail_url, e.duration_seconds, e.origin, e.season_id,
        (select count(*)::int from streaming_sources s where s.episode_id = e.id and s.is_active and s.authorization_verified and s.source_type in ('mp4', 'hls')) as playable
       from episodes e where e.anime_id = $1 order by e.episode_number`, [anime.id]),
		sql.query("select id, site, url, title, origin, confirmed_by_admin, episode_id from external_watch_links where anime_id = $1 and is_public = true order by site", [anime.id]),
		sql.query("select related from anime where id = $1", [anime.id])
	]);
	const relatedRaw = relatedRow[0]?.related;
	const relatedList = Array.isArray(relatedRaw) ? relatedRaw : typeof relatedRaw === "string" ? JSON.parse(relatedRaw) : [];
	const providerIds = relatedList.map((item) => item && typeof item === "object" ? String(item.providerId ?? "") : "").filter(Boolean);
	const local = providerIds.length ? await sql.query(`select provider_id, slug from anime where provider = $1 and provider_id = any($2::text[])`, [PROVIDER_ANILIST, providerIds]) : [];
	const slugByProvider = new Map(local.map((row) => [row.provider_id, row.slug]));
	return {
		anime,
		seasons: seasons.map((season) => ({
			id: String(season.id),
			number: Number(season.season_number),
			title: season.title == null ? null : String(season.title),
			synopsis: season.synopsis == null ? null : String(season.synopsis),
			origin: String(season.origin)
		})),
		episodes: episodes.map((episode) => ({
			id: String(episode.id),
			number: Number(episode.episode_number),
			title: episode.title == null ? null : String(episode.title),
			synopsis: episode.synopsis == null ? null : String(episode.synopsis),
			thumbnailUrl: safeHttpAsset(episode.thumbnail_url == null ? null : String(episode.thumbnail_url)),
			durationSeconds: episode.duration_seconds == null ? null : Number(episode.duration_seconds),
			origin: String(episode.origin),
			playable: Number(episode.playable ?? 0) > 0
		})),
		links: links.map((link) => ({
			id: String(link.id),
			site: String(link.site),
			url: String(link.url),
			title: link.title == null ? null : String(link.title),
			origin: String(link.origin),
			confirmedByAdmin: Boolean(link.confirmed_by_admin),
			episodeId: link.episode_id == null ? null : String(link.episode_id)
		})),
		related: relatedList.filter((item) => Boolean(item) && typeof item === "object").map((item) => ({
			providerId: String(item.providerId ?? ""),
			relation: String(item.relation ?? "OTHER"),
			title: String(item.title ?? ""),
			slug: slugByProvider.get(String(item.providerId ?? "")) ?? null
		}))
	};
}
async function loadEpisode(slug, number) {
	const detail = await loadAnime(slug);
	if (!detail) return null;
	const stored = detail.episodes.find((episode) => episode.number === number) ?? null;
	const count = detail.anime.episodeCount;
	if (!stored && !(count != null && number >= 1 && number <= count)) return null;
	const sql = await getSql();
	const sources = stored ? await sql.query(`select id, provider_name, source_type, playback_url, language, subtitles_language, subtitle_url, is_official
         from streaming_sources
         where episode_id = $1 and is_active = true and authorization_verified = true
         order by is_official desc, created_at`, [stored.id]) : [];
	const numbers = new Set(detail.episodes.map((episode) => episode.number));
	if (count && count > 0 && count <= 2e3) for (let n = 1; n <= count; n += 1) numbers.add(n);
	const ordered = [...numbers].sort((a, b) => a - b);
	const index = ordered.indexOf(number);
	return {
		anime: detail.anime,
		episode: stored,
		virtual: !stored,
		number,
		declaredCount: count,
		previous: index > 0 ? ordered[index - 1] : null,
		next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
		sources: sources.flatMap((source) => {
			const verdict = validateExternalUrl(String(source.playback_url));
			if (!verdict.ok) return [];
			const subtitle = source.subtitle_url == null ? null : validateExternalUrl(String(source.subtitle_url));
			return [{
				id: String(source.id),
				providerName: String(source.provider_name),
				sourceType: String(source.source_type),
				playbackUrl: verdict.href,
				language: source.language == null ? null : String(source.language),
				subtitlesLanguage: source.subtitles_language == null ? null : String(source.subtitles_language),
				subtitleUrl: subtitle && subtitle.ok ? subtitle.href : null,
				isOfficial: Boolean(source.is_official)
			}];
		}),
		links: detail.links.filter((link) => link.episodeId == null || link.episodeId === stored?.id)
	};
}
async function adminOverview() {
	const sql = await getSql();
	const [counts, recentAnime, runs, audits, messages] = await Promise.all([
		sql.query(`select
        (select count(*)::int from anime) as anime,
        (select count(*)::int from episodes) as episodes,
        (select count(*)::int from streaming_sources) as sources,
        (select count(*)::int from streaming_sources where authorization_verified and is_active) as active_sources,
        (select count(*)::int from "user") as users`),
		rowsOf(sql, `select ${FIELDS} from anime order by updated_at desc limit 6`),
		sql.query("select id, kind, status, success_count, failure_count, message, started_at, finished_at from sync_runs order by started_at desc limit 6"),
		sql.query("select id, action, entity_type, entity_id, detail, created_at from admin_audit_logs order by created_at desc limit 8"),
		sql.query("select id, name, email, message, created_at from contact_messages order by created_at desc limit 6")
	]);
	return {
		counts: counts[0] ?? {
			anime: 0,
			episodes: 0,
			sources: 0,
			active_sources: 0,
			users: 0
		},
		recentAnime,
		runs: runs.map((run) => ({
			id: String(run.id),
			kind: String(run.kind),
			status: String(run.status),
			success: Number(run.success_count ?? 0),
			failure: Number(run.failure_count ?? 0),
			message: run.message == null ? null : String(run.message),
			startedAt: iso(run.started_at),
			finishedAt: iso(run.finished_at)
		})),
		audits: audits.map((row) => ({
			id: String(row.id),
			action: String(row.action),
			entityType: String(row.entity_type),
			entityId: row.entity_id == null ? null : String(row.entity_id),
			detail: row.detail == null ? null : String(row.detail),
			createdAt: iso(row.created_at)
		})),
		messages: messages.map((row) => ({
			id: String(row.id),
			name: String(row.name),
			email: String(row.email),
			message: String(row.message),
			createdAt: iso(row.created_at)
		}))
	};
}
async function findDuplicates() {
	return (await getSql()).query(`select lower(title) as title, count(*)::int as n
     from anime group by lower(title) having count(*) > 1 order by n desc limit 20`);
}
async function touchProfile(userId, name, email, image) {
	const sql = await getSql();
	const emails = (process.env.KARTIFY_ADMIN_EMAILS ?? "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
	const shouldAdmin = email != null && emails.includes(email.toLowerCase());
	await sql.query(`insert into profiles (id, display_name, avatar_url, role)
     values ($1, $2, $3, $4)
     on conflict (id) do update set
       display_name = case when profiles.display_name = '' then excluded.display_name else profiles.display_name end,
       avatar_url = coalesce(profiles.avatar_url, excluded.avatar_url),
       role = case
         when profiles.role = 'suspended' then profiles.role
         when $5::boolean and profiles.role <> 'admin' then 'admin'
         else profiles.role
       end,
       updated_at = now()`, [
		userId,
		(name ?? "").slice(0, 80),
		safeHttpAsset(image),
		shouldAdmin ? "admin" : "user",
		shouldAdmin
	]);
	const row = (await sql.query("select id, display_name, avatar_url, role, preferred_locale from profiles where id = $1", [userId]))[0];
	return {
		id: userId,
		displayName: String(row?.display_name ?? name ?? ""),
		avatarUrl: row?.avatar_url == null ? null : String(row.avatar_url),
		role: String(row?.role ?? "user"),
		locale: row?.preferred_locale === "en" ? "en" : "ar",
		previewAdminAvailable: dbSource === "pglite"
	};
}
async function audit(adminId, action, entityType, entityId, detail) {
	await (await getSql()).query(`insert into admin_audit_logs (id, admin_user_id, action, entity_type, entity_id, detail)
     values ($1, $2, $3, $4, $5, $6)`, [
		randomUUID(),
		adminId,
		action,
		entityType,
		entityId,
		detail?.slice(0, 500) ?? null
	]);
}
//#endregion
export { adminOverview, audit, findDuplicates, loadAnime, loadCatalog, loadEpisode, loadHome, mapAnime, randomUUID, readSettings, syncFromAnilist, touchProfile };
