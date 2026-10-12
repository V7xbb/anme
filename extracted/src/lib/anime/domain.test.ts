import assert from "node:assert/strict";
import test from "node:test";
import {
  catalogSql,
  dedupeKey,
  isEmptyHome,
  normalizeCatalogInput,
  parseAnilistMedia,
  parseEpisodeNumber,
  resetRateLimits,
  rateLimit,
  slugify,
  stripHtml,
  validateExternalUrl,
  validatePlaybackUrl,
  asStringList,
} from "./domain.ts";

const fixture = {
  id: 101922,
  title: { romaji: "Kimetsu no Yaiba", english: "Demon Slayer", native: "鬼滅の刃" },
  description: "A boy fights demons.<br><br><i>Note</i>",
  coverImage: { extraLarge: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/a.jpg" },
  bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/a.jpg",
  genres: ["Action", "Drama"],
  format: "TV",
  status: "FINISHED",
  season: "SPRING",
  seasonYear: 2019,
  episodes: 26,
  duration: 24,
  averageScore: 84,
  popularity: 1000,
  updatedAt: 1_700_000_000,
  startDate: { year: 2019 },
  studios: { nodes: [{ name: "ufotable" }] },
  externalLinks: [
    { site: "Crunchyroll", url: "https://www.crunchyroll.com/series/abc", type: "STREAMING" },
    { site: "Pirate", url: "https://example-bad.test/watch", type: "STREAMING" },
    { site: "Twitter", url: "https://x.com/demo", type: "SOCIAL" },
    { site: "Loop", url: "http://127.0.0.1/secret", type: "STREAMING" },
  ],
  streamingEpisodes: [
    { title: "Episode 1 - Cruelty", thumbnail: "https://img.example.com/1.jpg", url: "https://www.crunchyroll.com/watch/ep1", site: "Crunchyroll" },
    { title: "Episode 2", thumbnail: "not a url", url: "https://192.168.0.8/stream.m3u8", site: "Local" },
  ],
  relations: {
    edges: [
      { relationType: "SEQUEL", node: { id: 12, type: "ANIME", format: "TV", title: { romaji: "Mugen Train" } } },
      { relationType: "ADAPTATION", node: { id: 99, type: "MANGA", title: { romaji: "Manga" } } },
    ],
  },
};

test("parses AniList media without treating links as playable sources", () => {
  const media = parseAnilistMedia(fixture);
  assert.ok(media);
  assert.equal(media?.providerId, "101922");
  assert.equal(dedupeKey(media!.provider, media!.providerId), "anilist:101922");
  assert.equal(media?.slug, slugify("Demon Slayer", "101922"));
  assert.equal(media?.originalTitle, "鬼滅の刃");
  assert.match(media?.synopsis ?? "", /A boy fights demons/);
  assert.equal(media?.synopsis?.includes("<br>"), false);
  assert.equal(media?.rating, 84);
  assert.equal(media?.ratingSource, "anilist");
  assert.equal(media?.mainStudio, "ufotable");
  assert.equal(media?.episodeCount, 26);
  assert.equal(media?.externalLinks.length, 2);
  assert.equal(media?.externalLinks[0]?.isPublic, true);
  assert.equal(media?.externalLinks[1]?.isPublic, false);
  assert.equal(media?.streamingEpisodes.length, 2);
  assert.equal(media?.streamingEpisodes[0]?.episodeNumber, 1);
  assert.equal(media?.streamingEpisodes[0]?.linkIsPublic, true);
  assert.equal(media?.streamingEpisodes[1]?.url, null);
  assert.equal(media?.related.length, 1);
  assert.equal(media?.related[0]?.providerId, "12");
});

test("drops media that has no id or title", () => {
  assert.equal(parseAnilistMedia(null), null);
  assert.equal(parseAnilistMedia({ id: 1, title: {} }), null);
  assert.equal(parseAnilistMedia({ title: { romaji: "X" } }), null);
});

test("strips markup and parses episode numbers", () => {
  assert.equal(stripHtml("A<br>B & C"), "A\nB & C");
  assert.equal(stripHtml(null), "");
  assert.equal(parseEpisodeNumber("Episode 12 - X", 0), 12);
  assert.equal(parseEpisodeNumber("第3話", 0), 3);
  assert.equal(parseEpisodeNumber("Preview", 4), 5);
});

test("playback validation blocks private hosts, insecure URLs, and unknown domains", () => {
  assert.equal(validatePlaybackUrl("http://cdn.example.com/a.mp4", ["cdn.example.com"]).ok, false);
  assert.equal(validatePlaybackUrl("https://127.0.0.1/a.mp4", ["127.0.0.1"]).ok, false);
  assert.equal(validatePlaybackUrl("https://10.1.1.5/a.m3u8", ["10.1.1.5"]).ok, false);
  const noList = validatePlaybackUrl("https://cdn.example.com/a.mp4", []);
  assert.equal(noList.ok, false);
  if (!noList.ok) assert.equal(noList.reason, "no-allowlist");
  const unknown = validatePlaybackUrl("https://evil.example/a.mp4", ["cdn.example.com"]);
  assert.equal(unknown.ok, false);
  if (!unknown.ok) assert.equal(unknown.reason, "domain");
  const ok = validatePlaybackUrl("https://cdn.example.com/a.m3u8", ["example.com"]);
  assert.equal(ok.ok, true);
  assert.equal(validateExternalUrl("https://user:pass@cdn.example.com/a").ok, false);
  assert.equal(validateExternalUrl("https://www.crunchyroll.com/series/abc").ok, true);
});

test("catalog filters are parameterized and ignore injected sort", () => {
  const injected = normalizeCatalogInput({
    q: "demon",
    genre: "Action",
    year: 2019,
    format: "TV",
    status: "FINISHED",
    sort: "rating; drop table anime" as never,
    page: 2,
    audio: "ar-sub",
  });
  assert.equal(injected.sort, "popular");
  const audio = normalizeCatalogInput({ ...injected, sort: "rating", audio: "ar-sub" });
  const sql = catalogSql(audio, "rows");
  assert.match(sql.text, /has_arabic_subs is true/);
  assert.match(sql.text, /order by rating desc/);
  assert.equal(sql.text.includes("drop table"), false);
  assert.ok(sql.params.includes("Action"));
  assert.ok(sql.params.includes(2019));
  const count = catalogSql(normalizeCatalogInput({ q: "" }), "count");
  assert.equal(count.text.includes("ilike"), false);
  assert.equal(isEmptyHome({ trending: [], popular: [], topRated: [], recent: [], season: [], movies: [] }), true);
});

test("genre arrays and rate limits", () => {
  assert.deepEqual(asStringList("{Action,Drama}"), ["Action", "Drama"]);
  resetRateLimits();
  assert.equal(rateLimit("sync", 2, 1_000, 1_000), true);
  assert.equal(rateLimit("sync", 2, 1_000, 1_100), true);
  assert.equal(rateLimit("sync", 2, 1_000, 1_200), false);
  assert.equal(rateLimit("sync", 2, 1_000, 3_000), true);
});
