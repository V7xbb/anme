//#region node_modules/.nitro/vite/services/ssr/assets/domain-C7YK6ubC.js
/** Pure catalog, metadata, and playback rules. No database or network. */
var PROVIDER_ANILIST = "anilist";
var OFFICIAL_STREAM_HOSTS = [
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
	"max.com"
];
var FORMATS = [
	"TV",
	"MOVIE",
	"OVA",
	"ONA",
	"SPECIAL",
	"MUSIC"
];
var STATUSES = [
	"FINISHED",
	"RELEASING",
	"NOT_YET_RELEASED",
	"CANCELLED",
	"HIATUS"
];
var SORTS = [
	"rating",
	"popular",
	"year",
	"title",
	"updated"
];
var AUDIO_FILTERS = [
	"",
	"ar-sub",
	"ar-dub",
	"eg-dub"
];
var SORT_SQL = {
	rating: "rating desc nulls last, popularity desc nulls last",
	popular: "popularity desc nulls last, rating desc nulls last",
	year: "release_year desc nulls last, title asc",
	title: "title asc",
	updated: "provider_updated_at desc nulls last, updated_at desc"
};
var ANIME_SELECT = `id, provider, provider_id, slug, title, title_ar, original_title, english_title,
  synopsis, synopsis_ar, synopsis_origin, poster_url, banner_url, genres, format, release_year,
  episode_count, episode_duration_minutes, airing_status, season, season_year, rating, rating_source,
  popularity, main_studio, metadata_language, data_origin, trending, has_arabic_subs, has_arabic_dub,
  has_egyptian_dub, related, provider_updated_at, last_synced_at`;
function animeSelect(alias = "") {
	const prefix = alias ? `${alias}.` : "";
	return ANIME_SELECT.split(",").map((part) => part.trim()).filter(Boolean).map((column) => `${prefix}${column}`).join(", ");
}
function stripHtml(input) {
	if (!input) return "";
	return input.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").replace(/"/g, "\"").replace(/&#0?39;|'/g, "'").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/&nbsp;/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
function slugify(input, providerId) {
	const base = input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72);
	const id = providerId.replace(/[^a-z0-9]+/gi, "").slice(0, 24) || "title";
	return `${base || "anime"}-${id}`;
}
function dedupeKey(provider, providerId) {
	return `${provider.trim().toLowerCase()}:${providerId.trim()}`;
}
function likePattern(q) {
	return `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
}
function currentSeason(date = /* @__PURE__ */ new Date()) {
	const month = date.getUTCMonth() + 1;
	const year = date.getUTCFullYear();
	if (month <= 3) return {
		season: "WINTER",
		year
	};
	if (month <= 6) return {
		season: "SPRING",
		year
	};
	if (month <= 9) return {
		season: "SUMMER",
		year
	};
	return {
		season: "FALL",
		year
	};
}
function clampPage(value) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n) || n < 1) return 1;
	return Math.min(500, Math.floor(n));
}
function clampBatch(value) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n) || n < 1) return 20;
	return Math.min(25, Math.floor(n));
}
function asStringList(value) {
	if (Array.isArray(value)) return value.filter((item) => typeof item === "string" && item.trim() !== "");
	if (typeof value === "string") {
		const inner = value.replace(/^\{|\}$/g, "").trim();
		if (!inner) return [];
		return inner.split(",").map((part) => part.trim().replace(/^"(.*)"$/, "$1")).filter(Boolean);
	}
	return [];
}
function hostAllowed(hostname, domains) {
	const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
	return domains.some((domain) => {
		const normalized = domain.toLowerCase().replace(/^\*\./, "").replace(/\.$/, "");
		if (!normalized) return false;
		return host === normalized || host.endsWith(`.${normalized}`);
	});
}
function isPrivateIp(hostname) {
	const host = hostname.toLowerCase();
	if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return true;
	const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (!ipv4) {
		if (host === "::1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) return true;
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
/** Playback URLs must be HTTPS, public, and on the admin allow-list. Never fetched server-side. */
function validatePlaybackUrl(raw, allowedDomains) {
	const trimmed = raw.trim();
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return {
			ok: false,
			reason: "invalid"
		};
	}
	if (url.protocol !== "https:") return {
		ok: false,
		reason: "https-only"
	};
	if (url.username || url.password) return {
		ok: false,
		reason: "credentials"
	};
	if (isPrivateIp(url.hostname)) return {
		ok: false,
		reason: "private-host"
	};
	if (allowedDomains.length === 0) return {
		ok: false,
		reason: "no-allowlist"
	};
	if (!hostAllowed(url.hostname, allowedDomains)) return {
		ok: false,
		reason: "domain"
	};
	return {
		ok: true,
		href: url.toString(),
		hostname: url.hostname.toLowerCase()
	};
}
/** Outbound watch links are not proxied. They still cannot target private hosts. */
function validateExternalUrl(raw) {
	const trimmed = raw.trim();
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return {
			ok: false,
			reason: "invalid"
		};
	}
	if (url.protocol !== "https:") return {
		ok: false,
		reason: "https-only"
	};
	if (url.username || url.password) return {
		ok: false,
		reason: "credentials"
	};
	if (isPrivateIp(url.hostname)) return {
		ok: false,
		reason: "private-host"
	};
	return {
		ok: true,
		href: url.toString(),
		hostname: url.hostname.toLowerCase()
	};
}
function parseEpisodeNumber(title, index) {
	if (title) {
		const match = title.match(/episode\s+(\d+)/i) || title.match(/\bep\.?\s*(\d+)/i) || title.match(/#\s*(\d+)/) || title.match(/第\s*(\d+)\s*話/);
		if (match) {
			const n = Number(match[1]);
			if (Number.isFinite(n) && n > 0 && n < 1e4) return n;
		}
	}
	return index + 1;
}
function str(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
function num(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	return value;
}
function parseAnilistMedia(raw) {
	if (!raw || typeof raw !== "object") return null;
	const media = raw;
	const id = num(media.id);
	if (id == null) return null;
	const titleObj = media.title && typeof media.title === "object" ? media.title : {};
	const romaji = str(titleObj.romaji);
	const english = str(titleObj.english);
	const native = str(titleObj.native);
	const title = romaji || english || native;
	if (!title) return null;
	const cover = media.coverImage && typeof media.coverImage === "object" ? media.coverImage : {};
	const start = media.startDate && typeof media.startDate === "object" ? media.startDate : {};
	const studios = media.studios && typeof media.studios === "object" ? media.studios : {};
	const mainStudio = (Array.isArray(studios.nodes) ? studios.nodes : []).map((node) => node && typeof node === "object" ? str(node.name) : null).find(Boolean) ?? null;
	const synopsis = stripHtml(str(media.description)) || null;
	const updated = num(media.updatedAt);
	const relations = media.relations && typeof media.relations === "object" ? media.relations : {};
	const related = [];
	if (Array.isArray(relations.edges)) for (const edge of relations.edges) {
		if (!edge || typeof edge !== "object") continue;
		const edgeObj = edge;
		const node = edgeObj.node;
		if (!node || typeof node !== "object") continue;
		const nodeObj = node;
		if (nodeObj.type !== "ANIME") continue;
		const relatedId = num(nodeObj.id);
		const relatedTitleObj = nodeObj.title && typeof nodeObj.title === "object" ? nodeObj.title : {};
		const relatedTitle = str(relatedTitleObj.romaji) || str(relatedTitleObj.english) || str(relatedTitleObj.native);
		if (relatedId == null || !relatedTitle) continue;
		related.push({
			providerId: String(relatedId),
			relation: str(edgeObj.relationType) ?? "OTHER",
			title: relatedTitle,
			format: str(nodeObj.format)
		});
	}
	const externalLinks = [];
	if (Array.isArray(media.externalLinks)) for (const link of media.externalLinks) {
		if (!link || typeof link !== "object") continue;
		const item = link;
		if (item.type !== "STREAMING") continue;
		const verdict = typeof item.url === "string" ? validateExternalUrl(item.url) : {
			ok: false,
			reason: "invalid"
		};
		if (!verdict.ok) continue;
		externalLinks.push({
			site: str(item.site) ?? verdict.hostname,
			url: verdict.href,
			isPublic: hostAllowed(verdict.hostname, OFFICIAL_STREAM_HOSTS)
		});
	}
	const streamingEpisodes = [];
	const seenNumbers = /* @__PURE__ */ new Set();
	if (Array.isArray(media.streamingEpisodes)) media.streamingEpisodes.forEach((episode, index) => {
		if (!episode || typeof episode !== "object") return;
		const item = episode;
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
			linkIsPublic: Boolean(verdict && verdict.ok && hostAllowed(verdict.hostname, OFFICIAL_STREAM_HOSTS))
		});
	});
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
		providerUpdatedAt: updated == null ? null : (/* @__PURE__ */ new Date(updated * 1e3)).toISOString(),
		externalLinks,
		streamingEpisodes
	};
}
function emptyCatalogInput() {
	return {
		q: "",
		genre: "",
		year: null,
		format: "",
		status: "",
		sort: "popular",
		page: 1,
		audio: ""
	};
}
function normalizeCatalogInput(input) {
	const base = emptyCatalogInput();
	if (!input) return base;
	const sort = SORTS.includes(input.sort) ? input.sort : base.sort;
	const audio = AUDIO_FILTERS.includes(input.audio) ? input.audio : "";
	const format = input.format && FORMATS.includes(input.format) ? input.format : "";
	const status = input.status && STATUSES.includes(input.status) ? input.status : "";
	const yearNumber = input.year == null ? null : Number(input.year);
	const year = yearNumber != null && Number.isFinite(yearNumber) && yearNumber >= 1960 && yearNumber <= 2100 ? Math.floor(yearNumber) : null;
	return {
		q: (input.q ?? "").trim().slice(0, 80),
		genre: (input.genre ?? "").trim().slice(0, 40),
		year,
		format,
		status,
		sort,
		page: clampPage(input.page ?? 1),
		audio,
		pageSize: clampBatch(input.pageSize ?? 24) === 0 ? 24 : Math.min(24, Math.max(1, input.pageSize ?? 24))
	};
}
function catalogSql(input, mode) {
	const params = [];
	const where = ["true"];
	const add = (value) => {
		params.push(value);
		return `$${params.length}`;
	};
	if (input.q) {
		const pattern = add(likePattern(input.q));
		where.push(`(title ilike ${pattern} escape '\\' or coalesce(english_title, '') ilike ${pattern} escape '\\' or coalesce(original_title, '') ilike ${pattern} escape '\\' or coalesce(title_ar, '') ilike ${pattern} escape '\\')`);
	}
	if (input.genre) where.push(`${add(input.genre)} = any(genres)`);
	if (input.year) where.push(`release_year = ${add(input.year)}`);
	if (input.format) where.push(`format = ${add(input.format)}`);
	if (input.status) where.push(`airing_status = ${add(input.status)}`);
	if (input.audio === "ar-sub") where.push("has_arabic_subs is true");
	if (input.audio === "ar-dub") where.push("has_arabic_dub is true");
	if (input.audio === "eg-dub") where.push("has_egyptian_dub is true");
	const clause = where.join(" and ");
	if (mode === "count") return {
		text: `select count(*)::int as total from anime where ${clause}`,
		params
	};
	const pageSize = input.pageSize ?? 24;
	const limit = add(pageSize);
	const offset = add((input.page - 1) * pageSize);
	return {
		text: `select ${ANIME_SELECT} from anime where ${clause} order by ${SORT_SQL[input.sort]}, id asc limit ${limit} offset ${offset}`,
		params
	};
}
function scoreLabel(rating) {
	if (rating == null) return null;
	return (rating / 10).toFixed(1);
}
function safeHttpAsset(url) {
	if (!url) return null;
	const verdict = validateExternalUrl(url);
	return verdict.ok ? verdict.href : null;
}
var hits = /* @__PURE__ */ new Map();
function rateLimit(key, limit, windowMs, now = Date.now()) {
	const current = hits.get(key);
	if (!current || now - current.t > windowMs) {
		hits.set(key, {
			n: 1,
			t: now
		});
		return true;
	}
	if (current.n >= limit) return false;
	current.n += 1;
	return true;
}
//#endregion
export { slugify as _, STATUSES as a, catalogSql as c, dedupeKey as d, normalizeCatalogInput as f, scoreLabel as g, safeHttpAsset as h, SORTS as i, clampBatch as l, rateLimit as m, FORMATS as n, animeSelect as o, parseAnilistMedia as p, PROVIDER_ANILIST as r, asStringList as s, AUDIO_FILTERS as t, currentSeason as u, validateExternalUrl as v, validatePlaybackUrl as y };
