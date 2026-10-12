import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { AnimeCard } from "@/components/media";
import { getCatalog } from "@/lib/anime/fns";
import { AUDIO_FILTERS, FORMATS, SORTS, STATUSES } from "@/lib/anime/domain";
import { blankSearch, readCatalogSearch, type CatalogSearch } from "@/lib/anime/search-params";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/catalog")({
  validateSearch: (search) => readCatalogSearch(search as Record<string, unknown>),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getCatalog({ data: deps }),
  head: () => ({ meta: [{ title: "الكتالوج — كارتيفاي أنمي" }] }),
  component: CatalogPage,
});

function CatalogPage() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });
  const { t, genre, format, status } = useI18n();
  function update(patch: Partial<CatalogSearch>) {
    void navigate({ search: { ...search, page: 1, ...patch } });
  }
  const years = Array.from({ length: 40 }, (_, index) => String(new Date().getUTCFullYear() - index));
  return (
    <SiteShell>
      <h1 className="mb-4 text-3xl font-extrabold">{t("catalog")}</h1>
      <form className="panel mb-6 grid gap-3 p-4 md:grid-cols-3" onSubmit={(event) => event.preventDefault()}>
        <label className="text-sm font-bold">{t("searchPlaceholder")}
          <input className="field mt-1" value={search.q} onChange={(event) => update({ q: event.target.value })} />
        </label>
        <label className="text-sm font-bold">{t("genres")}
          <select className="field mt-1" value={search.genre} onChange={(event) => update({ genre: event.target.value })}>
            <option value="">{t("all")}</option>
            {data.genres.map((item) => <option key={item} value={item}>{genre(item)}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold">{t("year")}
          <select className="field mt-1" value={search.year} onChange={(event) => update({ year: event.target.value })}>
            <option value="">{t("all")}</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold">{t("format")}
          <select className="field mt-1" value={search.format} onChange={(event) => update({ format: event.target.value })}>
            <option value="">{t("all")}</option>
            {FORMATS.map((item) => <option key={item} value={item}>{format(item)}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold">{t("status")}
          <select className="field mt-1" value={search.status} onChange={(event) => update({ status: event.target.value })}>
            <option value="">{t("all")}</option>
            {STATUSES.map((item) => <option key={item} value={item}>{status(item)}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold">{t("sort")}
          <select className="field mt-1" value={search.sort} onChange={(event) => update({ sort: event.target.value })}>
            {SORTS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm font-bold md:col-span-3">{t("audio")}
          <select className="field mt-1" value={search.audio} onChange={(event) => update({ audio: event.target.value })}>
            {AUDIO_FILTERS.map((item) => (
              <option key={item || "all"} value={item}>
                {item === "ar-sub" ? t("arabicSubs") : item === "ar-dub" ? t("arabicDub") : item === "eg-dub" ? t("egyptianDub") : t("all")}
              </option>
            ))}
          </select>
        </label>
      </form>
      <p className="mb-4 text-sm text-muted">{data.total} · {t("page")} {data.page} / {data.pages}</p>
      {data.items.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="font-bold">{t("empty")}</p>
          <Link to="/catalog" search={blankSearch} className="btn btn-ghost mt-4">{t("retry")}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {data.items.map((item) => <AnimeCard key={item.id} item={item} className="w-full" />)}
        </div>
      )}
      <div className="mt-6 flex gap-2">
        <button className="btn btn-ghost" type="button" disabled={search.page <= 1} onClick={() => update({ page: search.page - 1 })}>{t("previous")}</button>
        <button className="btn btn-ghost" type="button" disabled={search.page >= data.pages} onClick={() => update({ page: search.page + 1 })}>{t("next")}</button>
      </div>
    </SiteShell>
  );
}
