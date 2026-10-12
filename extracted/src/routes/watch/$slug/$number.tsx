import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Player, type PlaySource } from "@/components/player";
import { getEpisode, getProgress, saveProgress } from "@/lib/anime/fns";
import { displayTitle, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/watch/$slug/$number")({
  loader: async ({ params }) => {
    const number = Number(params.number);
    const data = await getEpisode({ data: { slug: params.slug, number } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.anime.title} ${loaderData.number} — كارتيفاي أنمي` : "حلقة" }],
  }),
  component: WatchPage,
  notFoundComponent: () => (
    <SiteShell><h1 className="text-3xl font-extrabold">الحلقة غير موجودة</h1></SiteShell>
  ),
});

function WatchPage() {
  const data = Route.useLoaderData();
  const { t, locale } = useI18n();
  const { user } = useCurrentUserState();
  const playable = (data.sources as PlaySource[]).filter((source) => source.sourceType === "mp4" || source.sourceType === "hls");
  const [sourceId, setSourceId] = useState(playable[0]?.id ?? "");
  const source = playable.find((item) => item.id === sourceId) ?? playable[0] ?? null;
  const [startAt, setStartAt] = useState(0);
  useEffect(() => {
    if (!user || !data.episode) return;
    getProgress({ data: data.episode.id })
      .then((row) => setStartAt(row?.progressSeconds ?? 0))
      .catch(() => undefined);
  }, [user, data.episode]);
  const lastSent = useRef(0);
  const external = data.sources.filter((item) => item.sourceType === "external");
  return (
    <SiteShell>
      <p className="text-sm text-muted">
        <Link to="/anime/$slug" params={{ slug: data.anime.slug }} className="font-bold text-accent">{displayTitle(data.anime, locale)}</Link>
      </p>
      <h1 className="mt-2 text-3xl font-extrabold">{t("episode")} {data.number}{data.episode?.title ? ` — ${data.episode.title}` : ""}</h1>
      {data.virtual ? <p className="mt-2 text-sm text-muted">{t("virtualEpisode")}</p> : null}
      {data.episode?.synopsis ? <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm">{data.episode.synopsis}</p> : null}
      {data.anime.episodeDurationMinutes ? (
        <p className="mt-2 text-xs text-muted">مدة الحلقة المعتادة حسب AniList: {data.anime.episodeDurationMinutes} دقيقة. ليست مدة هذا الملف.</p>
      ) : null}
      <div className="mt-5">
        <Player
          source={source}
          poster={data.episode?.thumbnailUrl}
          startAt={startAt}
          onProgress={(seconds, completed) => {
            if (!user || !data.episode) return;
            if (!completed && seconds - lastSent.current < 10) return;
            lastSent.current = seconds;
            void saveProgress({ data: { episodeId: data.episode.id, seconds, completed } }).catch(() => undefined);
          }}
        />
      </div>
      {playable.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {playable.map((item) => (
            <button key={item.id} type="button" className="btn btn-ghost" onClick={() => setSourceId(item.id)}>{item.providerName}</button>
          ))}
        </div>
      ) : null}
      {external.length || data.links.length ? (
        <section className="mt-6">
          <h2 className="font-extrabold">روابط مشاهدة خارجية</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {external.map((item) => (
              <li key={item.id}><a className="font-bold text-accent" href={item.playbackUrl} target="_blank" rel="noreferrer noopener">{item.providerName}</a></li>
            ))}
            {data.links.map((link) => (
              <li key={link.id}>
                <a className="font-bold text-accent" href={link.url} target="_blank" rel="noreferrer noopener">{link.site}</a>
                <span className="ms-2 text-xs text-muted">{link.confirmedByAdmin ? t("adminConfirmed") : t("externalNote")}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="mt-6 flex gap-2">
        {data.previous ? <Link className="btn btn-ghost" to="/watch/$slug/$number" params={{ slug: data.anime.slug, number: String(data.previous) }}>{t("previous")}</Link> : null}
        {data.next ? <Link className="btn btn-primary" to="/watch/$slug/$number" params={{ slug: data.anime.slug, number: String(data.next) }}>{t("next")}</Link> : null}
      </div>
    </SiteShell>
  );
}
