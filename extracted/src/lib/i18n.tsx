import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const copy = {
  ar: {
    brand: "كارتيفاي أنمي",
    tagline: "عالمك، قصتك، أنميك.",
    home: "الرئيسية",
    catalog: "الكتالوج",
    library: "مكتبتي",
    profile: "حسابي",
    admin: "الإدارة",
    login: "دخول",
    searchPlaceholder: "ابحث عن أنمي…",
    trending: "الرائج",
    popular: "الأكثر شعبية",
    top: "الأعلى تقييماً",
    recent: "تحديثات حديثة",
    season: "موسم العرض الحالي",
    movies: "أفلام أنمي",
    genres: "حسب التصنيف",
    forYou: "مقترح لك",
    details: "التفاصيل",
    addFavorite: "أضف إلى المفضلة",
    saved: "في المفضلة",
    watchlist: "قائمة المشاهدة",
    listed: "في القائمة",
    ratingFrom: "التقييم من AniList",
    noRating: "لا تقييم من المصدر",
    episodesMeta: "عدد الحلقات حسب المصدر",
    notPlayable: "هذا الرقم ليس دليلاً على وجود حلقة قابلة للتشغيل.",
    noSource: "No authorized playback source is currently available.",
    noSourceAr: "لا يوجد مصدر تشغيل مرخّص حالياً.",
    externalNote: "روابط خارجية كما وردت من AniList. ليست تشغيلاً داخل كارتيفاي.",
    adminConfirmed: "رابط أكّد المدير أنه مرخّص.",
    empty: "لا توجد نتائج مطابقة.",
    retry: "إعادة المحاولة",
    loading: "جارٍ التحميل",
    about: "عن المنصة",
    privacy: "الخصوصية",
    terms: "الشروط",
    contact: "تواصل",
    continue: "متابعة المشاهدة",
    favorites: "المفضلة",
    signInNeeded: "سجّل الدخول لاستخدام هذه الميزة.",
    year: "السنة",
    format: "النوع",
    status: "الحالة",
    sort: "الترتيب",
    audio: "اللغة الموثّقة",
    all: "الكل",
    apply: "تطبيق",
    page: "صفحة",
    related: "أعمال مرتبطة",
    synopsis: "القصة",
    synopsisNote: "الوصف من بيانات AniList وقد يكون بالإنجليزية. الترجمة العربية تُضاف فقط إذا أدخلها المدير.",
    studio: "الاستوديو",
    origin: "مصدر البيانات",
    provider: "مزود البيانات",
    adminData: "إدخال إداري",
    unverifiedLang: "حالة الدبلجة أو الترجمة غير موثّقة.",
    arabicSubs: "ترجمة عربية موثّقة",
    arabicDub: "دبلجة عربية موثّقة",
    egyptianDub: "دبلجة مصرية موثّقة",
    previous: "السابق",
    next: "التالي",
    episode: "حلقة",
    virtualEpisode: "لا يوجد سجل تفصيلي لهذه الحلقة. الرقم مأخوذ من عدد الحلقات المعلن فقط.",
    play: "تشغيل",
    language: "English",
  },
  en: {
    brand: "KARTIFY ANIME",
    tagline: "Your world. Your story. Your anime.",
    home: "Home",
    catalog: "Catalog",
    library: "My list",
    profile: "Account",
    admin: "Admin",
    login: "Sign in",
    searchPlaceholder: "Search anime…",
    trending: "Trending",
    popular: "Popular",
    top: "Top rated",
    recent: "Recently updated",
    season: "Current season",
    movies: "Anime movies",
    genres: "By genre",
    forYou: "For you",
    details: "Details",
    addFavorite: "Add to favorites",
    saved: "In favorites",
    watchlist: "Watchlist",
    listed: "On watchlist",
    ratingFrom: "Rating from AniList",
    noRating: "No source rating",
    episodesMeta: "Episode count from metadata",
    notPlayable: "This count is not proof that a playable episode exists.",
    noSource: "No authorized playback source is currently available.",
    noSourceAr: "No authorized playback source is currently available.",
    externalNote: "External links as reported by AniList. They are not in-app playback.",
    adminConfirmed: "Link confirmed as authorized by an admin.",
    empty: "Nothing matches these filters.",
    retry: "Try again",
    loading: "Loading",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    continue: "Continue watching",
    favorites: "Favorites",
    signInNeeded: "Sign in to use this feature.",
    year: "Year",
    format: "Format",
    status: "Status",
    sort: "Sort",
    audio: "Verified language",
    all: "All",
    apply: "Apply",
    page: "Page",
    related: "Related",
    synopsis: "Synopsis",
    synopsisNote: "Synopsis comes from AniList and may be English. Arabic text appears only when an admin enters it.",
    studio: "Studio",
    origin: "Data origin",
    provider: "Metadata provider",
    adminData: "Admin entry",
    unverifiedLang: "Dub and subtitle availability is unverified.",
    arabicSubs: "Verified Arabic subtitles",
    arabicDub: "Verified Arabic dub",
    egyptianDub: "Verified Egyptian dub",
    previous: "Previous",
    next: "Next",
    episode: "Episode",
    virtualEpisode: "No detailed episode record. This number only reflects the announced episode count.",
    play: "Play",
    language: "العربية",
  },
} as const;

export type Locale = keyof typeof copy;
export type CopyKey = keyof typeof copy.ar;

const genresAr: Record<string, string> = {
  Action: "أكشن",
  Adventure: "مغامرة",
  Comedy: "كوميديا",
  Drama: "دراما",
  Fantasy: "فانتازيا",
  Horror: "رعب",
  Mystery: "غموض",
  Romance: "رومانسي",
  "Sci-Fi": "خيال علمي",
  "Slice of Life": "شريحة من الحياة",
  Sports: "رياضة",
  Supernatural: "خارق للطبيعة",
  Thriller: "إثارة",
  Mecha: "ميكا",
  Music: "موسيقى",
  Psychological: "نفسي",
  Ecchi: "إيتشي",
};

const formatAr: Record<string, string> = {
  TV: "مسلسل",
  MOVIE: "فيلم",
  OVA: "أوفا",
  ONA: "أونا",
  SPECIAL: "حلقة خاصة",
  MUSIC: "موسيقي",
};

const statusAr: Record<string, string> = {
  FINISHED: "مكتمل",
  RELEASING: "يُعرض الآن",
  NOT_YET_RELEASED: "لم يُعرض بعد",
  CANCELLED: "ملغى",
  HIATUS: "متوقف",
};

type I18nValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: CopyKey) => string;
  setLocale: (locale: Locale) => void;
  genre: (name: string) => string;
  format: (name: string | null) => string;
  status: (name: string | null) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("kartify-locale");
    if (saved === "en" || saved === "ar") setLocale(saved);
    setReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    if (ready) localStorage.setItem("kartify-locale", locale);
  }, [locale, ready]);
  const value = useMemo<I18nValue>(() => ({
    locale,
    dir: locale === "ar" ? "rtl" : "ltr",
    setLocale,
    t: (key) => copy[locale][key],
    genre: (name) => (locale === "ar" ? genresAr[name] ?? name : name),
    format: (name) => (!name ? "—" : locale === "ar" ? formatAr[name] ?? name : name),
    status: (name) => (!name ? "—" : locale === "ar" ? statusAr[name] ?? name : name),
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("Locale missing");
  return value;
}

export function displayTitle(
  item: { title: string; titleAr?: string | null; englishTitle?: string | null },
  locale: Locale,
) {
  if (locale === "ar" && item.titleAr) return item.titleAr;
  if (item.englishTitle) return item.englishTitle;
  return item.title;
}
