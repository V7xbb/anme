import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { MetaLine, Poster, Rail, catalogHref, type CardItem } from "@/components/media";
import { getHome, getRecommendations } from "@/lib/anime/fns";
import { displayTitle, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({
  loader: () => getHome(),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.settings.brandNameAr ?? "كارتيفاي أنمي"} — KARTIFY ANIME` },
      { name: "description", content: loaderData?.settings.taglineAr ?? "عالمك، قصتك، أنميك." },
    ],
  }),
  pendingComponent: () => (
    <SiteShell>
      <div className="hero skel rounded-3xl" />
    </SiteShell>
  ),
  errorComponent: ({ error, reset }) => (
    <SiteShell>
      <div className="panel p-8 text-center">
        <h1 className="text-2xl font-extrabold">تعذر تحميل الكتالوج</h1>
        <p className="mt-3 text-muted">{error instanceof Error ? error.message : "تعذر تحميل الكتالوج"}</p>
        <button className="btn btn-primary mt-6" type="button" onClick={() => reset()}>إعادة المحاولة</button>
      </div>
    </SiteShell>
  ),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const { t, locale, genre } = useI18n();
  const featured = data.featured;
  const router = useRouter();
  return (
    <SiteShell>
      {featured ? (
        <section className="hero panel mb-8">
          {featured.bannerUrl ? (
            <img src={featured.bannerUrl} alt="" className="absolute inset-0 z-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 z-0">
              <Poster src={featured.posterUrl} alt="" priority />
            </div>
          )}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg via-bg/75 to-bg/20" />
          <div className="absolute inset-0 z-20 flex flex-col justify-end gap-4 p-5 sm:p-10">
            <p className="text-sm font-bold text-accent">{t("tagline")}</p>
            <h1 className="max-w-3xl text-4xl font-extrabold sm:text-6xl">{displayTitle(featured, locale)}</h1>
            <MetaLine item={featured} locale={locale} />
            <p className="max-w-2xl text-sm text-fg/90 line-clamp-3">
              {(locale === "ar" && featured.synopsisAr) || featured.synopsis || t("synopsisNote")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/anime/$slug" params={{ slug: featured.slug }} className="btn btn-primary">{t("details")}</Link>
              <Link to="/catalog" search={catalogHref({ sort: "popular" })} className="btn btn-ghost">{t("catalog")}</Link>
            </div>
          </div>
        </section>
      ) : (
        <div className="panel mb-8 p-8">
          <h1 className="text-3xl font-extrabold">{t("brand")}</h1>
          <p className="mt-2 text-muted">{t("empty")}</p>
          <button className="btn btn-primary mt-4" type="button" onClick={() => router.invalidate()}>{t("retry")}</button>
        </div>
      )}
      <div className="space-y-8">
        <ForYou />
        <Rail title={t("trending")} items={data.trending} />
        <Rail title={t("season")} items={data.seasonal} href={catalogHref({ status: "RELEASING" })} />
        <Rail title={t("popular")} items={data.popular} href={catalogHref({ sort: "popular" })} />
        <Rail title={t("top")} items={data.topRated} href={catalogHref({ sort: "rating" })} />
        <Rail title={t("recent")} items={data.recent} href={catalogHref({ sort: "updated" })} />
        <Rail title={t("movies")} items={data.movies} href={catalogHref({ format: "MOVIE" })} />
        {data.genreRails.map((rail) => (
          <Rail key={rail.genre} title={`${t("genres")}: ${genre(rail.genre)}`} items={rail.items as CardItem[]} href={catalogHref({ genre: rail.genre })} />
        ))}
      </div>
      <p className="mt-8 text-xs text-muted">
        {data.total} عنوان محفوظ من AniList. التقييمات منسوبة إلى AniList وليست مشاهدات داخل المنصة.
        {data.sync?.finishedAt ? ` · آخر مزامنة: ${data.sync.status}` : ""}
      </p>
    </SiteShell>
  );
}

function ForYou() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [items, setItems] = useState<CardItem[]>([]);
  useEffect(() => {
    if (isPending || !user) return;
    let cancelled = false;
    getRecommendations()
      .then((rows) => {
        if (!cancelled) setItems(rows);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isPending]);
  if (!items.length) return null;
  return <Rail title={t("forYou")} items={items} />;
}
