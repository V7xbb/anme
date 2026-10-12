import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, w as useRouter, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as useCurrentUserState, L as useI18n, l as displayTitle, r as SiteShell, w as getRecommendations } from "./site-shell-38quj5hE.mjs";
import { a as Route$17 } from "./router-DQajGQwF.mjs";
import { a as catalogHref, i as Rail, n as MetaLine, r as Poster } from "./media-B-j6820R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ClTsTLj7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const data = Route$17.useLoaderData();
	const { t, locale, genre } = useI18n();
	const featured = data.featured;
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hero panel mb-8",
			children: [
				featured.bannerUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: featured.bannerUrl,
					alt: "",
					className: "absolute inset-0 h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, {
					src: featured.posterUrl,
					alt: "",
					priority: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col justify-end gap-4 p-5 sm:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-accent",
							children: t("tagline")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "max-w-3xl text-4xl font-extrabold sm:text-6xl",
							children: displayTitle(featured, locale)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaLine, {
							item: featured,
							locale
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-2xl text-sm text-fg/90 line-clamp-3",
							children: locale === "ar" && featured.synopsisAr || featured.synopsis || t("synopsisNote")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/anime/$slug",
								params: { slug: featured.slug },
								className: "btn btn-primary",
								children: t("details")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/catalog",
								search: catalogHref({ sort: "popular" }),
								className: "btn btn-ghost",
								children: t("catalog")
							})]
						})
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel mb-8 p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold",
					children: t("brand")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: t("empty")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary mt-4",
					type: "button",
					onClick: () => router.invalidate(),
					children: t("retry")
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForYou, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: t("trending"),
					items: data.trending
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: t("season"),
					items: data.seasonal,
					href: catalogHref({ status: "RELEASING" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: t("popular"),
					items: data.popular,
					href: catalogHref({ sort: "popular" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: t("top"),
					items: data.topRated,
					href: catalogHref({ sort: "rating" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: t("recent"),
					items: data.recent,
					href: catalogHref({ sort: "updated" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: t("movies"),
					items: data.movies,
					href: catalogHref({ format: "MOVIE" })
				}),
				data.genreRails.map((rail) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					title: `${t("genres")}: ${genre(rail.genre)}`,
					items: rail.items,
					href: catalogHref({ genre: rail.genre })
				}, rail.genre))
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-8 text-xs text-muted",
			children: [
				data.total,
				" عنوان محفوظ من AniList. التقييمات منسوبة إلى AniList وليست مشاهدات داخل المنصة.",
				data.sync?.finishedAt ? ` · آخر مزامنة: ${data.sync.status}` : ""
			]
		})
	] });
}
function ForYou() {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let cancelled = false;
		getRecommendations().then((rows) => {
			if (!cancelled) setItems(rows);
		}).catch(() => {
			if (!cancelled) setItems([]);
		});
		return () => {
			cancelled = true;
		};
	}, [user, isPending]);
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
		title: t("forYou"),
		items
	});
}
//#endregion
export { Home as component };
