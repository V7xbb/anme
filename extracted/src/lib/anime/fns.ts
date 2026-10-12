import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { readCatalogSearch } from "./search-params";

export const getHome = createServerFn({ method: "GET" }).handler(async () => {
  const { loadHome } = await import("./repo.server");
  return loadHome();
});

export const getCatalog = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const data = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    const search = readCatalogSearch(data);
    return {
      ...search,
      year: search.year ? Number(search.year) : null,
    };
  })
  .handler(async ({ data }) => {
    const { loadCatalog } = await import("./repo.server");
    return loadCatalog({
      q: data.q,
      genre: data.genre,
      year: data.year,
      format: data.format,
      status: data.status,
      sort: data.sort as "popular",
      page: data.page,
      audio: data.audio as "",
    });
  });

export const getAnime = createServerFn({ method: "GET" })
  .validator((slug: string) => slug.trim().slice(0, 140))
  .handler(async ({ data }) => {
    const { loadAnime } = await import("./repo.server");
    return loadAnime(data);
  });

export const getEpisode = createServerFn({ method: "GET" })
  .validator((input: { slug: string; number: number }) => ({
    slug: input.slug.trim().slice(0, 140),
    number: Math.floor(Number(input.number)),
  }))
  .handler(async ({ data }) => {
    if (!Number.isFinite(data.number) || data.number < 1) return null;
    const { loadEpisode } = await import("./repo.server");
    return loadEpisode(data.slug, data.number);
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { profileFor } = await import("./mutations.server");
    return profileFor(context.userId);
  });

export const claimPreviewAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { claimPreviewAdmin: claim } = await import("./mutations.server");
    return claim(context.userId);
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName: string; avatarUrl: string; locale: string }) => input)
  .handler(async ({ data, context }) => {
    const { updateProfile: save } = await import("./mutations.server");
    return save(context.userId, data);
  });

export const getLibrary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { loadLibrary } = await import("./mutations.server");
    return loadLibrary(context.userId);
  });

export const getMembership = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { membership } = await import("./mutations.server");
    return membership(context.userId);
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((animeId: string) => animeId)
  .handler(async ({ data, context }) => {
    const { toggleFavorite: toggle } = await import("./mutations.server");
    return toggle(context.userId, data);
  });

export const toggleWatchlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((animeId: string) => animeId)
  .handler(async ({ data, context }) => {
    const { toggleWatchlist: toggle } = await import("./mutations.server");
    return toggle(context.userId, data);
  });

export const saveProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { episodeId: string; seconds: number; completed: boolean }) => input)
  .handler(async ({ data, context }) => {
    const { saveProgress: save } = await import("./mutations.server");
    return save(context.userId, data.episodeId, Number(data.seconds), Boolean(data.completed));
  });

export const getProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((episodeId: string) => episodeId)
  .handler(async ({ data, context }) => {
    const { progressFor } = await import("./mutations.server");
    return progressFor(context.userId, data);
  });

export const getRecommendations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { recommendations } = await import("./mutations.server");
    return recommendations(context.userId);
  });

export const submitContact = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; message: string }) => input)
  .handler(async ({ data }) => {
    const { submitContact: send } = await import("./mutations.server");
    return send(data);
  });

async function admin<T>(userId: string, run: (adminId: string) => Promise<T>): Promise<T> {
  const { profileFor } = await import("./mutations.server");
  const profile = await profileFor(userId);
  if (profile.role !== "admin") throw new Error("Forbidden");
  return run(userId);
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { adminOverview } = await import("./repo.server");
    return admin(context.userId, () => adminOverview());
  });

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) =>
    admin(context.userId, async () => {
      const { getSql } = await import("@/lib/db");
      const { readSettings } = await import("./repo.server");
      return readSettings(await getSql());
    }),
  );

export const saveAdminSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
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
  }) => input)
  .handler(async ({ data, context }) => {
    const { saveSettings } = await import("./mutations.server");
    return admin(context.userId, (id) => saveSettings(id, data));
  });

export const getAdminAnime = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((q: string) => (q ?? "").slice(0, 80))
  .handler(async ({ data, context }) => {
    const { adminAnimePage } = await import("./mutations.server");
    return admin(context.userId, () => adminAnimePage(data));
  });

export const saveAdminAnime = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => input)
  .handler(async ({ data, context }) => {
    const { saveAnime } = await import("./mutations.server");
    return admin(context.userId, (id) => saveAnime(id, data));
  });

export const deleteAdminAnime = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data, context }) => {
    const { deleteAnime } = await import("./mutations.server");
    return admin(context.userId, (adminId) => deleteAnime(adminId, data));
  });

export const getAdminEpisodes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((animeId: string) => animeId)
  .handler(async ({ data, context }) => {
    const { adminEpisodes } = await import("./mutations.server");
    return admin(context.userId, () => adminEpisodes(data));
  });

export const saveAdminEpisode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => input)
  .handler(async ({ data, context }) => {
    const { saveEpisode } = await import("./mutations.server");
    return admin(context.userId, (id) => saveEpisode(id, data));
  });

export const deleteAdminEpisode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data, context }) => {
    const { deleteEpisode } = await import("./mutations.server");
    return admin(context.userId, (adminId) => deleteEpisode(adminId, data));
  });

export const getAdminSources = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((episodeId: string) => episodeId)
  .handler(async ({ data, context }) => {
    const { adminSources } = await import("./mutations.server");
    return admin(context.userId, () => adminSources(data));
  });

export const saveAdminSource = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => input)
  .handler(async ({ data, context }) => {
    const { saveSource } = await import("./mutations.server");
    return admin(context.userId, (id) => saveSource(id, data));
  });

export const deleteAdminSource = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data, context }) => {
    const { deleteSource } = await import("./mutations.server");
    return admin(context.userId, (adminId) => deleteSource(adminId, data));
  });

export const runAdminSync = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: string; search?: string; page?: number; id?: number }) => input)
  .handler(async ({ data, context }) => {
    const { runSync } = await import("./mutations.server");
    return admin(context.userId, (id) => runSync(id, data));
  });

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { listUsers } = await import("./mutations.server");
    return admin(context.userId, () => listUsers());
  });

export const setAdminUserRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; role: string }) => input)
  .handler(async ({ data, context }) => {
    const { setUserRole } = await import("./mutations.server");
    return admin(context.userId, (id) => setUserRole(id, data.userId, data.role));
  });
