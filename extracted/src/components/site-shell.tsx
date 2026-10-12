import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Clapperboard, House, Library, Search, UserRound } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/anime/fns";
import { useI18n } from "@/lib/i18n";
import { blankSearch } from "@/lib/anime/search-params";
import { Logo } from "./logo";

export function SiteShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { user } = useCurrentUserState();
  const [q, setQ] = useState("");
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (!user) {
      setAdmin(false);
      return;
    }
    let cancelled = false;
    getMyProfile()
      .then((profile) => {
        if (!cancelled) setAdmin(profile.role === "admin");
      })
      .catch(() => {
        if (!cancelled) setAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    void navigate({ to: "/catalog", search: { ...blankSearch, q } });
  }

  const links = [
    { to: "/", label: t("home"), icon: House },
    { to: "/catalog", label: t("catalog"), icon: Clapperboard },
    { to: "/library", label: t("library"), icon: Library },
    { to: "/profile", label: t("profile"), icon: UserRound },
  ] as const;

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold">
            <Logo />
            <span className="leading-tight">
              {t("brand")}
              <span className="block text-xs font-semibold text-muted">{t("tagline")}</span>
            </span>
          </Link>
          <form onSubmit={onSearch} className="ms-auto hidden min-w-0 flex-1 md:block md:max-w-md">
            <label className="sr-only" htmlFor="site-search">{t("searchPlaceholder")}</label>
            <div className="flex gap-2">
              <input id="site-search" className="field" value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("searchPlaceholder")} />
              <button className="btn btn-primary" type="submit"><Search className="size-4" aria-hidden="true" /></button>
            </div>
          </form>
          <nav className="ms-auto hidden items-center gap-4 md:flex">
            {links.slice(1, 3).map((link) => (
              <Link key={link.to} to={link.to} search={link.to === "/catalog" ? blankSearch : undefined} className="text-sm font-bold text-muted hover:text-fg">
                {link.label}
              </Link>
            ))}
            {admin ? <Link to="/admin" className="text-sm font-bold text-accent">{t("admin")}</Link> : null}
            <button type="button" className="btn btn-ghost px-3" onClick={() => setLocale(locale === "ar" ? "en" : "ar")}>
              {t("language")}
            </button>
            {user ? <UserButton /> : <Link to="/login" className="btn btn-primary">{t("login")}</Link>}
          </nav>
          <button type="button" className="btn btn-ghost ms-auto px-3 md:hidden" onClick={() => setLocale(locale === "ar" ? "en" : "ar")}>
            {t("language")}
          </button>
        </div>
        <form onSubmit={onSearch} className="mx-auto flex max-w-7xl gap-2 px-4 pb-3 md:hidden">
          <label className="sr-only" htmlFor="mobile-search">{t("searchPlaceholder")}</label>
          <input id="mobile-search" className="field" value={q} onChange={(event) => setQ(event.target.value)} placeholder={t("searchPlaceholder")} />
          <button className="btn btn-primary" type="submit" aria-label={t("searchPlaceholder")}><Search className="size-4" /></button>
        </form>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mx-auto hidden max-w-7xl flex-wrap gap-4 px-4 pb-8 text-sm text-muted md:flex">
        <Link to="/about">{t("about")}</Link>
        <Link to="/privacy">{t("privacy")}</Link>
        <Link to="/terms">{t("terms")}</Link>
        <Link to="/contact">{t("contact")}</Link>
      </footer>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-bg-2 md:hidden">
        {links.map((link) => {
          const Icon = link.icon;
          const active = path === link.to;
          return (
            <Link key={link.to} to={link.to} search={link.to === "/catalog" ? blankSearch : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-bold ${active ? "text-accent" : "text-muted"}`}>
              <Icon className="size-5" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
