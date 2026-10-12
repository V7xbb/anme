import { clampBatch, parseAnilistMedia, type ParsedMedia } from "./domain";

const ENDPOINT = "https://graphql.anilist.co";

const MEDIA_QUERY = `query (
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

export type AnilistPage = {
  media: ParsedMedia[];
  pageInfo: { total: number | null; currentPage: number | null; lastPage: number | null; hasNextPage: boolean };
};

type Variables = {
  page?: number;
  perPage?: number;
  sort?: string[];
  search?: string;
  season?: string;
  seasonYear?: number;
  format?: string;
  id?: number;
};

function cleanVariables(input: Variables): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value == null || value === "") continue;
    out[key] = value;
  }
  out.page = input.page && input.page > 0 ? input.page : 1;
  out.perPage = clampBatch(input.perPage ?? 20);
  return out;
}

async function post(variables: Variables, attempt = 0): Promise<unknown> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: MEDIA_QUERY, variables: cleanVariables(variables) }),
  });
  if (response.status === 429 && attempt < 2) {
    await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    return post(variables, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`AniList request failed (${response.status})`);
  }
  const body = (await response.json()) as { data?: unknown; errors?: { message?: string }[] };
  if (body.errors?.length) {
    throw new Error(body.errors[0]?.message || "AniList returned an error");
  }
  return body.data;
}

export async function fetchAnilistPage(variables: Variables): Promise<AnilistPage> {
  const data = (await post(variables)) as {
    Page?: { pageInfo?: AnilistPage["pageInfo"]; media?: unknown[] };
  };
  const page = data?.Page;
  const media = Array.isArray(page?.media) ? page.media : [];
  return {
    media: media.map((item) => parseAnilistMedia(item)).filter((item): item is ParsedMedia => item != null),
    pageInfo: {
      total: page?.pageInfo?.total ?? null,
      currentPage: page?.pageInfo?.currentPage ?? null,
      lastPage: page?.pageInfo?.lastPage ?? null,
      hasNextPage: Boolean(page?.pageInfo?.hasNextPage),
    },
  };
}
