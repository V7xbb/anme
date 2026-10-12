import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, S as Navigate, T as require_jsx_runtime, et as require_react, m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { n as blankSearch, r as readCatalogSearch, t as authMiddleware } from "./search-params-B3Zy_7CL.mjs";
import { i as signOut, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as hasGateSessionMarker } from "./server-DWzvqhMl.mjs";
import { t as Logo } from "./logo-CkTdP6CC.mjs";
import { a as Library, i as Search, o as House, s as Clapperboard, t as UserRound } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-38quj5hE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var copy = {
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
		language: "English"
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
		language: "العربية"
	}
};
var genresAr = {
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
	Ecchi: "إيتشي"
};
var formatAr = {
	TV: "مسلسل",
	MOVIE: "فيلم",
	OVA: "أوفا",
	ONA: "أونا",
	SPECIAL: "حلقة خاصة",
	MUSIC: "موسيقي"
};
var statusAr = {
	FINISHED: "مكتمل",
	RELEASING: "يُعرض الآن",
	NOT_YET_RELEASED: "لم يُعرض بعد",
	CANCELLED: "ملغى",
	HIATUS: "متوقف"
};
var I18nContext = (0, import_react.createContext)(null);
function LocaleProvider({ children }) {
	const [locale, setLocale] = (0, import_react.useState)("ar");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("kartify-locale");
		if (saved === "en" || saved === "ar") setLocale(saved);
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = locale;
		document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
		if (ready) localStorage.setItem("kartify-locale", locale);
	}, [locale, ready]);
	const value = (0, import_react.useMemo)(() => ({
		locale,
		dir: locale === "ar" ? "rtl" : "ltr",
		setLocale,
		t: (key) => copy[locale][key],
		genre: (name) => locale === "ar" ? genresAr[name] ?? name : name,
		format: (name) => !name ? "—" : locale === "ar" ? formatAr[name] ?? name : name,
		status: (name) => !name ? "—" : locale === "ar" ? statusAr[name] ?? name : name
	}), [locale]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, {
		value,
		children
	});
}
function useI18n() {
	const value = (0, import_react.useContext)(I18nContext);
	if (!value) throw new Error("Locale missing");
	return value;
}
function displayTitle(item, locale) {
	if (locale === "ar" && item.titleAr) return item.titleAr;
	if (item.englishTitle) return item.englishTitle;
	return item.title;
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getHome = createServerFn({ method: "GET" }).handler(createSsrRpc("3e28fadac4cf20033ced64c7e3b7e6b0c886bd55045cd9bbdd37343f5f54d6b1"));
var getCatalog = createServerFn({ method: "GET" }).validator((input) => {
	const search = readCatalogSearch(input && typeof input === "object" ? input : {});
	return {
		...search,
		year: search.year ? Number(search.year) : null
	};
}).handler(createSsrRpc("52b65126ece0d5044bb565dbc1b150108b4d156f5f9fa677cfa08e173138cdfe"));
var getAnime = createServerFn({ method: "GET" }).validator((slug) => slug.trim().slice(0, 140)).handler(createSsrRpc("4978ee8ce289138ac23246824287983bbb8a196992e01b88beddf43033edbd4b"));
var getEpisode = createServerFn({ method: "GET" }).validator((input) => ({
	slug: input.slug.trim().slice(0, 140),
	number: Math.floor(Number(input.number))
})).handler(createSsrRpc("500ae620ba208a4f2041929260def2013fd9250d50ce0100d2671156934245cf"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7e0e1634c52e8f3653bb30cb324a50d7a7826e63ed7f8f6708abdc808f8575b3"));
var claimPreviewAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("e765123f477d958165128e3dfdf5e24a80335fd0be6e7bb0798af443fc336af3"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("293e656833b0f02ad51a208c18d81c360897043d8354f9a2d556f1f0fb41d2e7"));
var getLibrary = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1228d0cbc1e8be2dbd6390eeb1788679bda38086b24412f973b866b6ce709fb7"));
var getMembership = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("932f3ed8d7dd4db055410cc3a71abec97242a3564975117f847a95d07dc1cdd4"));
var toggleFavorite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((animeId) => animeId).handler(createSsrRpc("eee0dbd3c108f2cf7ef7de0e90b40a6c2a642dea03a209ee69c155faa6e30bd2"));
var toggleWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((animeId) => animeId).handler(createSsrRpc("373028a7b926c54cc7fce37c8348ffd05ba4b96bfa6683938e39d17e7a2d484b"));
var saveProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4ab8b16f4698d53d23394f7e5d159877fc5e6e11f3adf1f56ec94e06c2c043a0"));
var getProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((episodeId) => episodeId).handler(createSsrRpc("e03a0197f2ca595386361d7a832d03df86ce43f74312451398f908bda06d2870"));
var getRecommendations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fd33e7bdc51106ccdbfe147acc6a4ddbb879e31bb9e4de9af6676183e95b4d57"));
var submitContact = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e5ad8d21fd4c1dbfe798c5fcaeb7d44e9eb94ead56c2cb971c280d5bd64bf84b"));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e97aceacc74d4aef481979a073b24b46da4f1043f81c68df9966240d4bd0b376"));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fc87c4a39822d6ade7cde39d34374975614690ad8cb3c58986d20db7ebb4e706"));
var saveAdminSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("392df5fc128209806ad865f9dc0f86543e967afd5f534cc41fa55b133eca7ba2"));
var getAdminAnime = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((q) => (q ?? "").slice(0, 80)).handler(createSsrRpc("89576efd05927e10fe2afe83686ad4c131f87e7d8b2999f03faff62347a64dc0"));
var saveAdminAnime = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("778754704dacff50f98193aaaa169ffbb398f29699adfd5ace43f0e00b5d6a88"));
var deleteAdminAnime = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("7f1945153b8d3ebf296f01ae499131c5cf6f93a3074bfe89e579da00c0330533"));
var getAdminEpisodes = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((animeId) => animeId).handler(createSsrRpc("fc4555772a38b85464cf1977a7ff4e9c9021c46884647c05b7baa3c3117d0ec3"));
var saveAdminEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5b49d2d3361ed98d6ec97c786eae50b12c987f7c942555dea7a9990d138454e3"));
var deleteAdminEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("f75da07b51f525d73fd99bf4decb0a3a4737363bff6952c5cac439598af8034b"));
var getAdminSources = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((episodeId) => episodeId).handler(createSsrRpc("9dd5349aa031f4759ff385d441bc12aad1e9e4e2ec7933d1af8eed97627a7c09"));
var saveAdminSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1c080650b687a464249b9f767eba2315aa991c488bbcc5e62cabc65dc841922e"));
var deleteAdminSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("43f7f9039ede65d50f9abce430f2589af6551cfac847014b5027907827eae6d5"));
var runAdminSync = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("af8ad984814aa8f65ea7674f52f7593268b4f4360815ac7a4251ab3808c8b557"));
var getAdminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a2172e7b6fb407a8669a11a2c471b9991bde8ad9eb13633a3b3fcb7e36fc7b01"));
var setAdminUserRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ffa63eb303281abb75a7b8f6eb0ff9216c91ea6214b7ebac96bf5e513f6bf054"));
function SiteShell({ children }) {
	const { t, locale, setLocale } = useI18n();
	const navigate = useNavigate();
	const path = useRouterState({ select: (state) => state.location.pathname });
	const { user } = useCurrentUserState();
	const [q, setQ] = (0, import_react.useState)("");
	const [admin, setAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setAdmin(false);
			return;
		}
		let cancelled = false;
		getMyProfile().then((profile) => {
			if (!cancelled) setAdmin(profile.role === "admin");
		}).catch(() => {
			if (!cancelled) setAdmin(false);
		});
		return () => {
			cancelled = true;
		};
	}, [user]);
	function onSearch(event) {
		event.preventDefault();
		navigate({
			to: "/catalog",
			search: {
				...blankSearch,
				q
			}
		});
	}
	const links = [
		{
			to: "/",
			label: t("home"),
			icon: House
		},
		{
			to: "/catalog",
			label: t("catalog"),
			icon: Clapperboard
		},
		{
			to: "/library",
			label: t("library"),
			icon: Library
		},
		{
			to: "/profile",
			label: t("profile"),
			icon: UserRound
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-24 md:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 font-extrabold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "leading-tight",
								children: [t("brand"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-semibold text-muted",
									children: t("tagline")
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: onSearch,
							className: "ms-auto hidden min-w-0 flex-1 md:block md:max-w-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "site-search",
								children: t("searchPlaceholder")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "site-search",
									className: "field",
									value: q,
									onChange: (event) => setQ(event.target.value),
									placeholder: t("searchPlaceholder")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-primary",
									type: "submit",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "size-4",
										"aria-hidden": "true"
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ms-auto hidden items-center gap-4 md:flex",
							children: [
								links.slice(1, 3).map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: link.to,
									search: link.to === "/catalog" ? blankSearch : void 0,
									className: "text-sm font-bold text-muted hover:text-fg",
									children: link.label
								}, link.to)),
								admin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin",
									className: "text-sm font-bold text-accent",
									children: t("admin")
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-ghost px-3",
									onClick: () => setLocale(locale === "ar" ? "en" : "ar"),
									children: t("language")
								}),
								user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "btn btn-primary",
									children: t("login")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ghost ms-auto px-3 md:hidden",
							onClick: () => setLocale(locale === "ar" ? "en" : "ar"),
							children: t("language")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onSearch,
					className: "mx-auto flex max-w-7xl gap-2 px-4 pb-3 md:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "mobile-search",
							children: t("searchPlaceholder")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "mobile-search",
							className: "field",
							value: q,
							onChange: (event) => setQ(event.target.value),
							placeholder: t("searchPlaceholder")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-primary",
							type: "submit",
							"aria-label": t("searchPlaceholder"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-7xl px-4 py-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mx-auto hidden max-w-7xl flex-wrap gap-4 px-4 pb-8 text-sm text-muted md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						children: t("about")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/privacy",
						children: t("privacy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/terms",
						children: t("terms")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						children: t("contact")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-bg-2 md:hidden",
				children: links.map((link) => {
					const Icon = link.icon;
					const active = path === link.to;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: link.to,
						search: link.to === "/catalog" ? blankSearch : void 0,
						className: `flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-bold ${active ? "text-accent" : "text-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							"aria-hidden": "true"
						}), link.label]
					}, link.to);
				})
			})
		]
	});
}
//#endregion
export { saveProgress as A, getProgress as C, saveAdminEpisode as D, saveAdminAnime as E, updateProfile as F, useCurrentUserState as I, useI18n as L, submitContact as M, toggleFavorite as N, saveAdminSettings as O, toggleWatchlist as P, getMyProfile as S, runAdminSync as T, getCatalog as _, claimPreviewAdmin as a, getLibrary as b, deleteAdminSource as c, getAdminEpisodes as d, getAdminOverview as f, getAnime as g, getAdminUsers as h, UserButton as i, setAdminUserRole as j, saveAdminSource as k, displayTitle as l, getAdminSources as m, RedirectToSignIn as n, deleteAdminAnime as o, getAdminSettings as p, SiteShell as r, deleteAdminEpisode as s, LocaleProvider as t, getAdminAnime as u, getEpisode as v, getRecommendations as w, getMembership as x, getHome as y };
