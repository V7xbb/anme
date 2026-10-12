import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Poster } from "@/components/media";
import { SaveButtons } from "@/components/save-buttons";
import { getAnime } from "@/lib/anime/fns";
import { scoreLabel } from "@/lib/anime/domain";
import { displayTitle, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/anime/$slug")({
  loader: async ({ params }) => {
    const data = await getAnime({ data: params.slug });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.anime.englishTitle || loaderData.anime.title} — كارتيفاي أنمي` : "كارتيفاي أنمي" },
      { name: "description", content: (loaderData?.anime.synopsis ?? "تفاصيل الأنمي").slice(0, 180) },
    ],
    links: [{ rel: "canonical", href: `/anime/${loaderData?.anime.slug ?? ""}` }],
  }),
  component: AnimePage,
  notFoundComponent: () => (
    <SiteShell>
      <h1 className="text-3xl font-extrabold">العنوان غير موجود</h1>
    </SiteShell>
  ),
});

function AnimePage() {
  const data = Route.useLoaderData();
  const { anime, episodes, seasons, links, related } = data;
  const { t, locale, genre, format, status } = useI18n();
  const title = displayTitle(anime, locale);
  const synopsis = locale === "ar" && anime.synopsisAr ? anime.synopsisAr : anime.synopsis;
  const score = scoreLabel(anime.rating);
  const numbers = episodes.map((episode) => episode.number);
  const virtualCount = anime.episodeCount && anime.episodeCount <= 48 ? anime.episodeCount : 0;
  const shown = new Set(numbers);
  const virtuals = virtualCount
    ? Array.from({ length: virtualCount }, (_, index) => index + 1).filter((n) => !shown.has(n))
    : [];
  return (
    <SiteShell>
      <article className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="poster-frame panel overflow-hidden">
          <Poster src={anime.posterUrl} alt="" priority />
        </div>
        <div className="space-y-4">
          <p className="text-sm font-bold text-accent">{anime.englishTitle && title !== anime.title ? anime.title : anime.originalTitle}</p>
          <h1 className="text-4xl font-extrabold">{title}</h1>
          <p className="text-sm text-muted">
            {format(anime.format)} · {status(anime.airingStatus)} · {anime.releaseYear ?? "—"}
            {anime.season ? ` · ${anime.season} ${anime.seasonYear ?? ""}` : ""}
          </p>
          <p className="text-sm">{score ? `${score} / 10 · ${t("ratingFrom")}` : t("noRating")}</p>
          <p className="text-sm text-muted">
            {t("episodesMeta")}: {anime.episodeCount ?? "—"} · {t("notPlayable")}
          </p>
          {anime.mainStudio ? <p className="text-sm">{t("studio")}: {anime.mainStudio}</p> : null}
          <p className="text-sm text-muted">
            {t("origin")}: {anime.dataOrigin === "admin" ? t("adminData") : `${t("provider")} · ${anime.provider} #${anime.providerId}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {anime.genres.map((item) => (
              <Link key={item} to="/catalog" search={{ q: "", page: 1, genre: item, year: "", format: "", status: "", sort: "popular", audio: "" }} className="rounded-full border border-line px-3 py-1 text-sm">
                {genre(item)}
              </Link>
            ))}
          </div>
          <LanguageFlags anime={anime} />
          <SaveButtons animeId={anime.id} />
        </div>
      </article>
      <section className="mt-8 space-y-2">
        <h2 className="text-2xl font-extrabold">{t("synopsis")}</h2>
        <p className="whitespace-pre-wrap text-sm leading-7">{synopsis || t("empty")}</p>
        {!anime.synopsisAr ? <p className="text-xs text-muted">{t("synopsisNote")}</p> : null}
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-extrabold">{t("episode")}</h2>
        {seasons.map((season) => (
          <p key={season.id} className="mb-2 text-sm text-muted">{season.title} · {season.origin}</p>
        ))}
        {episodes.length === 0 && virtuals.length === 0 ? <p className="text-muted">{t("virtualEpisode")}</p> : null}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {episodes.map((episode) => (
            <Link key={episode.id} to="/watch/$slug/$number" params={{ slug: anime.slug, number: String(episode.number) }} className="panel p-3 text-sm">
              <span className="font-bold">{t("episode")} {episode.number}</span>
              <span className="mt-1 block truncate text-muted">{episode.title || (episode.playable ? t("play") : t("noSourceAr"))}</span>
            </Link>
          ))}
          {virtuals.map((number) => (
            <Link key={number} to="/watch/$slug/$number" params={{ slug: anime.slug, number: String(number) }} className="panel p-3 text-sm text-muted">
              {t("episode")} {number}
            </Link>
          ))}
        </div>
        {anime.episodeCount && anime.episodeCount > 48 ? (
          <p className="mt-3 text-sm text-muted">{t("episodesMeta")}: {anime.episodeCount}. استخدم رقم الحلقة في الرابط حتى هذا العدد.</p>
        ) : null}
      </section>
      <section className="mt-8">
        <h2 className="mb-2 text-2xl font-extrabold">روابط خارجية</h2>
        <p className="mb-3 text-sm text-muted">{t("externalNote")}</p>
        {links.length === 0 ? <p className="text-sm text-muted">{t("empty")}</p> : (
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id}>
                <a className="font-bold text-accent" href={link.url} target="_blank" rel="noreferrer noopener">{link.site}</a>
                <span className="ms-2 text-xs text-muted">{link.confirmedByAdmin ? t("adminConfirmed") : t("externalNote")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-extrabold">{t("related")}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {related.map((item) => (
            <li key={`${item.relation}-${item.providerId}`} className="panel p-3 text-sm">
              <span className="text-muted">{item.relation}</span>
              {item.slug ? (
                <Link to="/anime/$slug" params={{ slug: item.slug }} className="mt-1 block font-bold">{item.title}</Link>
              ) : (
                <span className="mt-1 block font-bold">{item.title}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}

function LanguageFlags({ anime }: { anime: { hasArabicSubs: boolean | null; hasArabicDub: boolean | null; hasEgyptianDub: boolean | null } }) {
  const { t } = useI18n();
  const known = [anime.hasArabicSubs, anime.hasArabicDub, anime.hasEgyptianDub].some((flag) => flag != null);
  if (!known) return <p className="text-sm text-muted">{t("unverifiedLang")}</p>;
  return (
    <ul className="text-sm">
      {anime.hasArabicSubs === true ? <li>{t("arabicSubs")}</li> : null}
      {anime.hasArabicDub === true ? <li>{t("arabicDub")}</li> : null}
      {anime.hasEgyptianDub === true ? <li>{t("egyptianDub")}</li> : null}
      {anime.hasArabicSubs === false && anime.hasArabicDub === false && anime.hasEgyptianDub === false ? <li>{t("unverifiedLang")}</li> : null}
    </ul>
  );
}
