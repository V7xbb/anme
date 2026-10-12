import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  deleteAdminAnime,
  deleteAdminEpisode,
  deleteAdminSource,
  getAdminAnime,
  getAdminEpisodes,
  getAdminOverview,
  getAdminSettings,
  getAdminSources,
  getAdminUsers,
  getMyProfile,
  runAdminSync,
  saveAdminAnime,
  saveAdminEpisode,
  saveAdminSettings,
  saveAdminSource,
  setAdminUserRole,
} from "@/lib/anime/fns";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "الإدارة — كارتيفاي أنمي" }, { name: "robots", content: "noindex" }] }),
});

const tabs = ["overview", "anime", "episodes", "sources", "sync", "users", "settings"] as const;
type Tab = (typeof tabs)[number];

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [role, setRole] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  useEffect(() => {
    if (!user) return;
    getMyProfile()
      .then((profile) => setRole(profile.role))
      .catch(() => setRole("denied"));
  }, [user]);
  if (isPending || (user && role == null)) return <SiteShell><p>جارٍ التحقق…</p></SiteShell>;
  if (!user) return <SiteShell><RedirectToSignIn /></SiteShell>;
  if (role !== "admin") {
    return (
      <SiteShell>
        <h1 className="text-3xl font-extrabold">غير مسموح</h1>
        <p className="mt-2 text-muted">فعّل صلاحية المدير من الحساب في المعاينة، أو عبر KARTIFY_ADMIN_EMAILS في الإنتاج.</p>
      </SiteShell>
    );
  }
  return (
    <SiteShell>
      <h1 className="mb-4 text-3xl font-extrabold">لوحة الإدارة</h1>
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item} type="button" className={`btn ${tab === item ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>
      {tab === "overview" ? <Overview /> : null}
      {tab === "anime" ? <AnimeAdmin /> : null}
      {tab === "episodes" ? <EpisodeAdmin /> : null}
      {tab === "sources" ? <SourceAdmin /> : null}
      {tab === "sync" ? <SyncAdmin /> : null}
      {tab === "users" ? <UsersAdmin /> : null}
      {tab === "settings" ? <SettingsAdmin /> : null}
    </SiteShell>
  );
}

function Overview() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminOverview>> | null>(null);
  useEffect(() => {
    getAdminOverview().then(setData).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }, []);
  if (!data) return <div className="skel h-40 rounded-2xl" />;
  const cards = [
    ["عناوين", data.counts.anime],
    ["حلقات مسجّلة", data.counts.episodes],
    ["مصادر", data.counts.sources],
    ["مصادر مفعّلة وموثّقة", data.counts.active_sources],
    ["مستخدمون", data.counts.users],
  ] as const;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="panel p-4"><p className="text-sm text-muted">{label}</p><p className="text-3xl font-extrabold">{value}</p></div>
        ))}
      </div>
      <section className="panel p-4">
        <h2 className="font-extrabold">آخر مزامنة</h2>
        {data.runs.length === 0 ? <p className="text-sm text-muted">لا توجد عمليات بعد.</p> : data.runs.map((run) => (
          <p key={run.id} className="text-sm text-muted">{run.kind} · {run.status} · نجح {run.success} · فشل {run.failure} · {run.message}</p>
        ))}
      </section>
      <section className="panel p-4">
        <h2 className="font-extrabold">سجل الإدارة</h2>
        {data.audits.map((row) => <p key={row.id} className="text-sm text-muted">{row.action} · {row.entityType} · {row.detail}</p>)}
      </section>
      <section className="panel p-4">
        <h2 className="font-extrabold">رسائل التواصل</h2>
        {data.messages.map((row) => <p key={row.id} className="text-sm">{row.name} · {row.email}: {row.message}</p>)}
      </section>
    </div>
  );
}

function AnimeAdmin() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getAdminAnime>> | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({ title: "", titleAr: "", genres: "", format: "TV", airingStatus: "FINISHED", lockSynopsis: false, lockPoster: false });
  function load(query = q) {
    getAdminAnime({ data: query }).then(setRows).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }
  useEffect(() => { load(""); }, []);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="field" value={q} onChange={(event) => setQ(event.target.value)} placeholder="بحث بالعنوان أو معرف المزود" />
        <button className="btn btn-primary" type="button" onClick={() => load()}>بحث</button>
      </div>
      <form className="panel grid gap-2 p-4 md:grid-cols-2" onSubmit={(event) => {
        event.preventDefault();
        saveAdminAnime({ data: form }).then(() => { toast.success("حُفظ"); load(); }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
      }}>
        {["title", "titleAr", "englishTitle", "originalTitle", "genres", "posterUrl", "bannerUrl", "releaseYear", "episodeCount", "season", "seasonYear", "synopsis", "synopsisAr"].map((key) => (
          <label key={key} className="text-xs font-bold">{key}
            {key.startsWith("synopsis") ? <textarea className="field mt-1 min-h-24 py-2" value={String(form[key] ?? "")} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /> : <input className="field mt-1" value={String(form[key] ?? "")} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />}
          </label>
        ))}
        <label className="text-xs">ترجمة عربية
          <select className="field mt-1" value={String(form.hasArabicSubs ?? "unknown")} onChange={(event) => setForm({ ...form, hasArabicSubs: event.target.value })}>
            <option value="unknown">غير موثّق</option><option value="yes">نعم</option><option value="no">لا</option>
          </select>
        </label>
        <label className="text-xs">دبلجة عربية
          <select className="field mt-1" value={String(form.hasArabicDub ?? "unknown")} onChange={(event) => setForm({ ...form, hasArabicDub: event.target.value })}>
            <option value="unknown">غير موثّق</option><option value="yes">نعم</option><option value="no">لا</option>
          </select>
        </label>
        <label className="text-xs">دبلجة مصرية
          <select className="field mt-1" value={String(form.hasEgyptianDub ?? "unknown")} onChange={(event) => setForm({ ...form, hasEgyptianDub: event.target.value })}>
            <option value="unknown">غير موثّق</option><option value="yes">نعم</option><option value="no">لا</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.lockSynopsis)} onChange={(event) => setForm({ ...form, lockSynopsis: event.target.checked })} /> حماية الوصف الإنجليزي من المزامنة</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.lockPoster)} onChange={(event) => setForm({ ...form, lockPoster: event.target.checked })} /> تثبيت الملصق</label>
        <button className="btn btn-primary" type="submit">{form.id ? "تحديث" : "إنشاء"}</button>
      </form>
      <div className="panel p-4 text-sm">
        <h2 className="font-extrabold">تكرار محتمل في العناوين</h2>
        {rows?.duplicates.length ? rows.duplicates.map((row) => <p key={row.title}>{row.title} · {row.n}</p>) : <p className="text-muted">لا تكرار ظاهر.</p>}
      </div>
      <ul className="space-y-2">
        {rows?.items.map((item) => (
          <li key={item.id} className="panel flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
            <span>{item.title} · {item.provider}:{item.providerId}</span>
            <span className="flex gap-2">
              <button type="button" className="btn btn-ghost" onClick={() => setForm({
                id: item.id, title: item.title, titleAr: item.titleAr ?? "", englishTitle: item.englishTitle ?? "", originalTitle: item.originalTitle ?? "",
                genres: item.genres.join(", "), posterUrl: item.posterUrl ?? "", bannerUrl: item.bannerUrl ?? "", releaseYear: String(item.releaseYear ?? ""),
                episodeCount: String(item.episodeCount ?? ""), season: item.season ?? "", seasonYear: String(item.seasonYear ?? ""), synopsis: item.synopsis ?? "",
                synopsisAr: item.synopsisAr ?? "", format: item.format ?? "TV", airingStatus: item.airingStatus ?? "FINISHED",
                hasArabicSubs: item.hasArabicSubs == null ? "unknown" : item.hasArabicSubs ? "yes" : "no",
                hasArabicDub: item.hasArabicDub == null ? "unknown" : item.hasArabicDub ? "yes" : "no",
                hasEgyptianDub: item.hasEgyptianDub == null ? "unknown" : item.hasEgyptianDub ? "yes" : "no",
                lockPoster: false, lockSynopsis: false,
              })}>تعديل</button>
              <button type="button" className="btn btn-ghost" onClick={() => {
                if (!confirm("حذف السجل وكل الحلقات المرتبطة؟")) return;
                deleteAdminAnime({ data: item.id }).then(() => load()).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
              }}>حذف</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EpisodeAdmin() {
  const [animeId, setAnimeId] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminEpisodes>> | null>(null);
  const [form, setForm] = useState({ animeId: "", number: "1", title: "", synopsis: "", thumbnailUrl: "", durationSeconds: "", seasonId: "" });
  function load() {
    if (!animeId) return;
    getAdminEpisodes({ data: animeId }).then(setData).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input className="field" placeholder="معرّف الأنمي" value={animeId} onChange={(event) => setAnimeId(event.target.value)} />
        <button className="btn btn-primary" type="button" onClick={load}>عرض</button>
      </div>
      <form className="panel grid gap-2 p-4" onSubmit={(event) => {
        event.preventDefault();
        saveAdminEpisode({ data: { ...form, animeId: form.animeId || animeId, number: Number(form.number), durationSeconds: Number(form.durationSeconds) } })
          .then(() => { toast.success("حُفظت الحلقة"); load(); })
          .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
      }}>
        <input className="field" placeholder="رقم الحلقة" value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} />
        <input className="field" placeholder="العنوان" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <textarea className="field min-h-20 py-2" placeholder="الوصف" value={form.synopsis} onChange={(event) => setForm({ ...form, synopsis: event.target.value })} />
        <input className="field" placeholder="صورة https" value={form.thumbnailUrl} onChange={(event) => setForm({ ...form, thumbnailUrl: event.target.value })} />
        <input className="field" placeholder="المدة بالثواني" value={form.durationSeconds} onChange={(event) => setForm({ ...form, durationSeconds: event.target.value })} />
        <select className="field" value={form.seasonId} onChange={(event) => setForm({ ...form, seasonId: event.target.value })}>
          <option value="">بدون موسم</option>
          {data?.seasons.map((season) => <option key={season.id} value={season.id}>{season.number} · {season.title}</option>)}
        </select>
        <button className="btn btn-primary" type="submit">حفظ الحلقة</button>
      </form>
      <ul className="space-y-2 text-sm">
        {data?.episodes.map((episode) => (
          <li key={episode.id} className="panel flex justify-between gap-2 p-3">
            <span>{episode.number}. {episode.title || "بدون عنوان"} · {episode.origin}</span>
            <button type="button" className="btn btn-ghost" onClick={() => deleteAdminEpisode({ data: episode.id }).then(load)}>حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourceAdmin() {
  const [episodeId, setEpisodeId] = useState("");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getAdminSources>>>([]);
  const [form, setForm] = useState({ providerName: "", sourceType: "mp4", playbackUrl: "", language: "", subtitlesLanguage: "", subtitleUrl: "", isOfficial: false, isActive: false, authorizationConfirmed: false });
  function load() {
    if (!episodeId) return;
    getAdminSources({ data: episodeId }).then(setRows).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">لن يُحفظ مصدر بدون تأكيد صريح أن الترخيص متاح، ولن يُعرض للزوار إلا إذا كان موثّقاً ومفعّلاً وعلى نطاق مسموح.</p>
      <div className="flex gap-2">
        <input className="field" placeholder="معرّف الحلقة" value={episodeId} onChange={(event) => setEpisodeId(event.target.value)} />
        <button className="btn btn-primary" type="button" onClick={load}>عرض</button>
      </div>
      <form className="panel grid gap-2 p-4" onSubmit={(event) => {
        event.preventDefault();
        saveAdminSource({ data: { ...form, episodeId } })
          .then(() => { toast.success("حُفظ المصدر"); load(); })
          .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
      }}>
        <input className="field" placeholder="اسم المزود" value={form.providerName} onChange={(event) => setForm({ ...form, providerName: event.target.value })} />
        <select className="field" value={form.sourceType} onChange={(event) => setForm({ ...form, sourceType: event.target.value })}>
          <option value="mp4">mp4</option><option value="hls">hls</option><option value="external">رابط خارجي</option>
        </select>
        <input className="field" placeholder="https://" value={form.playbackUrl} onChange={(event) => setForm({ ...form, playbackUrl: event.target.value })} />
        <input className="field" placeholder="لغة الصوت" value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })} />
        <input className="field" placeholder="لغة الترجمة" value={form.subtitlesLanguage} onChange={(event) => setForm({ ...form, subtitlesLanguage: event.target.value })} />
        <input className="field" placeholder="ملف ترجمة https" value={form.subtitleUrl} onChange={(event) => setForm({ ...form, subtitleUrl: event.target.value })} />
        <label className="text-sm"><input type="checkbox" checked={form.isOfficial} onChange={(event) => setForm({ ...form, isOfficial: event.target.checked })} /> رسمي</label>
        <label className="text-sm"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> مفعّل</label>
        <label className="text-sm font-bold"><input type="checkbox" checked={form.authorizationConfirmed} onChange={(event) => setForm({ ...form, authorizationConfirmed: event.target.checked })} /> أؤكد أن هذا المصدر مرخّص ومصرّح بتشغيله</label>
        <button className="btn btn-primary" type="submit">حفظ المصدر</button>
      </form>
      <ul className="space-y-2 text-sm">
        {rows.map((row) => (
          <li key={row.id} className="panel p-3">
            <p>{row.providerName} · {row.sourceType} · {row.authorizationVerified ? "موثّق" : "غير موثّق"} · {row.isActive ? "مفعّل" : "متوقف"}</p>
            <p className="truncate text-muted">{row.playbackUrl}</p>
            <button type="button" className="btn btn-ghost mt-2" onClick={() => deleteAdminSource({ data: row.id }).then(load)}>حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SyncAdmin() {
  const [kind, setKind] = useState("trending");
  const [search, setSearch] = useState("");
  const [anilistId, setAnilistId] = useState("");
  const [report, setReport] = useState("");
  return (
    <form className="panel space-y-3 p-4" onSubmit={(event) => {
      event.preventDefault();
      runAdminSync({ data: { kind, search, id: anilistId ? Number(anilistId) : undefined, page: 1 } })
        .then((result) => setReport(`${result.ok ? "تم" : "غير مكتمل"} · نجح ${result.success} · فشل ${result.failure} · ${result.message}`))
        .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
    }}>
      <p className="text-sm text-muted">المزامنة تجلب بيانات وصفية من AniList فقط. لا تُنشئ روابط تشغيل.</p>
      <select className="field" value={kind} onChange={(event) => setKind(event.target.value)}>
        <option value="trending">رائج</option>
        <option value="popular">شائع</option>
        <option value="season">الموسم الحالي</option>
        <option value="movies">أفلام</option>
        <option value="search">بحث</option>
        <option value="id">معرّف AniList</option>
      </select>
      <input className="field" placeholder="عبارة البحث" value={search} onChange={(event) => setSearch(event.target.value)} />
      <input className="field" placeholder="AniList id" value={anilistId} onChange={(event) => setAnilistId(event.target.value)} />
      <button className="btn btn-primary" type="submit">مزامنة دفعة</button>
      {report ? <p className="text-sm">{report}</p> : null}
    </form>
  );
}

function UsersAdmin() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getAdminUsers>>>([]);
  function load() {
    getAdminUsers().then(setRows).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }
  useEffect(() => { load(); }, []);
  return (
    <ul className="space-y-2 text-sm">
      {rows.map((row) => (
        <li key={row.id} className="panel flex flex-wrap items-center justify-between gap-2 p-3">
          <span>{row.displayName || row.name} · {row.email} · {row.role}</span>
          <span className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setAdminUserRole({ data: { userId: row.id, role: "suspended" } }).then(load)}>إيقاف</button>
            <button type="button" className="btn btn-ghost" onClick={() => setAdminUserRole({ data: { userId: row.id, role: "user" } }).then(load)}>تفعيل</button>
          </span>
        </li>
      ))}
    </ul>
  );
}

function SettingsAdmin() {
  const [form, setForm] = useState({
    brandNameAr: "", brandNameEn: "", taglineAr: "", taglineEn: "", defaultLocale: "ar", syncBatchSize: 12,
    allowedDomains: "", recommendationsEnabled: true, continueWatchingEnabled: true, bilingualEnabled: true,
  });
  useEffect(() => {
    getAdminSettings().then((settings) => setForm({
      brandNameAr: settings.brandNameAr,
      brandNameEn: settings.brandNameEn,
      taglineAr: settings.taglineAr,
      taglineEn: settings.taglineEn,
      defaultLocale: settings.defaultLocale,
      syncBatchSize: settings.syncBatchSize,
      allowedDomains: settings.allowedDomains.join("\n"),
      recommendationsEnabled: settings.recommendationsEnabled,
      continueWatchingEnabled: settings.continueWatchingEnabled,
      bilingualEnabled: settings.bilingualEnabled,
    })).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }, []);
  return (
    <form className="panel grid gap-3 p-4" onSubmit={(event) => {
      event.preventDefault();
      saveAdminSettings({ data: form }).then(() => toast.success("حُفظت الإعدادات")).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
    }}>
      <input className="field" value={form.brandNameAr} onChange={(event) => setForm({ ...form, brandNameAr: event.target.value })} />
      <input className="field" value={form.brandNameEn} onChange={(event) => setForm({ ...form, brandNameEn: event.target.value })} />
      <input className="field" value={form.taglineAr} onChange={(event) => setForm({ ...form, taglineAr: event.target.value })} />
      <input className="field" value={form.taglineEn} onChange={(event) => setForm({ ...form, taglineEn: event.target.value })} />
      <textarea className="field min-h-24 py-2" placeholder="نطاقات التشغيل المسموحة، نطاق في كل سطر" value={form.allowedDomains} onChange={(event) => setForm({ ...form, allowedDomains: event.target.value })} />
      <label className="text-sm">حجم الدفعة
        <input className="field mt-1" type="number" min={1} max={25} value={form.syncBatchSize} onChange={(event) => setForm({ ...form, syncBatchSize: Number(event.target.value) })} />
      </label>
      <label className="text-sm"><input type="checkbox" checked={form.recommendationsEnabled} onChange={(event) => setForm({ ...form, recommendationsEnabled: event.target.checked })} /> التوصيات</label>
      <label className="text-sm"><input type="checkbox" checked={form.continueWatchingEnabled} onChange={(event) => setForm({ ...form, continueWatchingEnabled: event.target.checked })} /> متابعة المشاهدة</label>
      <label className="text-sm"><input type="checkbox" checked={form.bilingualEnabled} onChange={(event) => setForm({ ...form, bilingualEnabled: event.target.checked })} /> الواجهة ثنائية اللغة</label>
      <button className="btn btn-primary" type="submit">حفظ الإعدادات</button>
    </form>
  );
}
