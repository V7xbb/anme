import { Link } from "@tanstack/react-router";
import { Clapperboard, Star } from "lucide-react";
import { useState } from "react";
import { displayTitle, useI18n, type Locale } from "@/lib/i18n";
import { scoreLabel } from "@/lib/anime/domain";
import { blankSearch } from "@/lib/anime/search-params";

export type CardItem = {
  id: string;
  slug: string;
  title: string;
  titleAr: string | null;
  englishTitle: string | null;
  posterUrl: string | null;
  bannerUrl?: string | null;
  genres: string[];
  format: string | null;
  releaseYear: number | null;
  episodeCount: number | null;
  airingStatus: string | null;
  rating: number | null;
  ratingSource: string | null;
  season?: string | null;
  seasonYear?: number | null;
  synopsis?: string | null;
  synopsisAr?: string | null;
};

export function Poster({ src, alt, priority = false }: { src: string | null; alt: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-bg-2 text-muted">
        <Clapperboard className="size-8" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export function AnimeCard({ item, className = "w-40 shrink-0 sm:w-44" }: { item: CardItem; className?: string }) {
  const { locale, genre, format } = useI18n();
  const title = displayTitle(item, locale);
  const score = scoreLabel(item.rating);
  return (
    <Link
      to="/anime/$slug"
      params={{ slug: item.slug }}
      className={`panel group block overflow-hidden motion-safe:transition-transform motion-safe:hover:-translate-y-1 ${className}`}
    >
      <div className="poster-frame overflow-hidden">
        <Poster src={item.posterUrl} alt="" />
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 min-h-12 text-sm font-bold">{title}</h3>
        <p className="truncate text-xs text-muted">
          {format(item.format)}
          {item.releaseYear ? ` · ${item.releaseYear}` : ""}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted">
          <Star className="size-3 text-accent" aria-hidden="true" />
          {score ? <span>{score}</span> : <span>—</span>}
          {item.genres[0] ? <span className="truncate">· {genre(item.genres[0])}</span> : null}
        </p>
      </div>
    </Link>
  );
}

export function Rail({ title, items, href }: { title: string; items: CardItem[]; href?: CatalogHref }) {
  const { t } = useI18n();
  if (!items.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-xl font-extrabold">{title}</h2>
        {href ? (
          <Link to="/catalog" search={href} className="text-sm font-bold text-accent">
            {t("catalog")}
          </Link>
        ) : null}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <AnimeCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

type CatalogHref = typeof blankSearch;

export function catalogHref(patch: Partial<CatalogHref> = {}): CatalogHref {
  return { ...blankSearch, ...patch };
}

export function MetaLine({ item, locale }: { item: CardItem; locale: Locale }) {
  const { format, status, t } = useI18n();
  const score = scoreLabel(item.rating);
  return (
    <p className="text-sm text-muted">
      {format(item.format)}
      {item.releaseYear ? ` · ${item.releaseYear}` : ""}
      {item.airingStatus ? ` · ${status(item.airingStatus)}` : ""}
      {score ? ` · ${score} · ${t("ratingFrom")}` : ` · ${t("noRating")}`}
      {locale ? "" : ""}
    </p>
  );
}
