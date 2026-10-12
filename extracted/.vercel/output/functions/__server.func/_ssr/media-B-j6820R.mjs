import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as blankSearch } from "./search-params-B3Zy_7CL.mjs";
import { r as Star, s as Clapperboard } from "../_libs/lucide-react.mjs";
import { L as useI18n, l as displayTitle } from "./site-shell-38quj5hE.mjs";
import { g as scoreLabel } from "./domain-C7YK6ubC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media-B-j6820R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Poster({ src, alt, priority = false }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	if (!src || failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full w-full place-items-center bg-bg-2 text-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {
			className: "size-8",
			"aria-hidden": "true"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		loading: priority ? "eager" : "lazy",
		className: "h-full w-full object-cover",
		onError: () => setFailed(true)
	});
}
function AnimeCard({ item, className = "w-40 shrink-0 sm:w-44" }) {
	const { locale, genre, format } = useI18n();
	const title = displayTitle(item, locale);
	const score = scoreLabel(item.rating);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/anime/$slug",
		params: { slug: item.slug },
		className: `panel group block overflow-hidden motion-safe:transition-transform motion-safe:hover:-translate-y-1 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "poster-frame overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, {
				src: item.posterUrl,
				alt: ""
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 min-h-12 text-sm font-bold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-xs text-muted",
					children: [format(item.format), item.releaseYear ? ` · ${item.releaseYear}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
							className: "size-3 text-accent",
							"aria-hidden": "true"
						}),
						score ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: score }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "—" }),
						item.genres[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: ["· ", genre(item.genres[0])]
						}) : null
					]
				})
			]
		})]
	});
}
function Rail({ title, items, href }) {
	const { t } = useI18n();
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-extrabold",
				children: title
			}), href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/catalog",
				search: href,
				className: "text-sm font-bold text-accent",
				children: t("catalog")
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-3 overflow-x-auto pb-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimeCard, { item }, item.id))
		})]
	});
}
function catalogHref(patch = {}) {
	return {
		...blankSearch,
		...patch
	};
}
function MetaLine({ item, locale }) {
	const { format, status, t } = useI18n();
	const score = scoreLabel(item.rating);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted",
		children: [
			format(item.format),
			item.releaseYear ? ` · ${item.releaseYear}` : "",
			item.airingStatus ? ` · ${status(item.airingStatus)}` : "",
			score ? ` · ${score} · ${t("ratingFrom")}` : ` · ${t("noRating")}`,
			locale ? "" : ""
		]
	});
}
//#endregion
export { catalogHref as a, Rail as i, MetaLine as n, Poster as r, AnimeCard as t };
