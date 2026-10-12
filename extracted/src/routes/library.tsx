import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { AnimeCard, type CardItem } from "@/components/media";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getLibrary } from "@/lib/anime/fns";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  head: () => ({ meta: [{ title: "مكتبتي — كارتيفاي أنمي" }] }),
});

function LibraryPage() {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [data, setData] = useState<Awaited<ReturnType<typeof getLibrary>> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    getLibrary().then(setData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Error"));
  }, [user]);
  if (isPending) return <SiteShell><p>{t("loading")}</p></SiteShell>;
  if (!user) return <SiteShell><RedirectToSignIn /></SiteShell>;
  return (
    <SiteShell>
      <h1 className="mb-6 text-3xl font-extrabold">{t("library")}</h1>
      {error ? <p className="text-danger">{error}</p> : null}
      {!data ? <div className="skel h-40 rounded-2xl" /> : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-extrabold">{t("continue")}</h2>
            {data.continueWatching.length === 0 ? <p className="text-sm text-muted">{t("empty")}</p> : (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.continueWatching.map((item) => (
                  <Link key={item.episodeId} to="/watch/$slug/$number" params={{ slug: item.slug, number: String(item.episodeNumber) }} className="panel p-4">
                    <p className="font-bold">{item.titleAr || item.englishTitle || item.title}</p>
                    <p className="text-sm text-muted">{t("episode")} {item.episodeNumber} · {Math.floor(item.progressSeconds / 60)}m</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
          <Shelf title={t("favorites")} items={data.favorites as CardItem[]} />
          <Shelf title={t("watchlist")} items={data.watchlist as CardItem[]} />
        </div>
      )}
    </SiteShell>
  );
}

function Shelf({ title, items }: { title: string; items: CardItem[] }) {
  const { t } = useI18n();
  return (
    <section>
      <h2 className="mb-3 text-xl font-extrabold">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-muted">{t("empty")}</p> : (
        <div className="flex gap-3 overflow-x-auto">{items.map((item) => <AnimeCard key={item.id} item={item} />)}</div>
      )}
    </section>
  );
}
