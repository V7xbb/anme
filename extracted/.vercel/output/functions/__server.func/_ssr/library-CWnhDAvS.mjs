import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as useCurrentUserState, L as useI18n, b as getLibrary, n as RedirectToSignIn, r as SiteShell } from "./site-shell-38quj5hE.mjs";
import { t as AnimeCard } from "./media-B-j6820R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-CWnhDAvS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryPage() {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getLibrary().then(setData).catch((reason) => setError(reason instanceof Error ? reason.message : "Error"));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loading") }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-3xl font-extrabold",
			children: t("library")
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-danger",
			children: error
		}) : null,
		!data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skel h-40 rounded-2xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-xl font-extrabold",
					children: t("continue")
				}), data.continueWatching.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: t("empty")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: data.continueWatching.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/watch/$slug/$number",
						params: {
							slug: item.slug,
							number: String(item.episodeNumber)
						},
						className: "panel p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: item.titleAr || item.englishTitle || item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								t("episode"),
								" ",
								item.episodeNumber,
								" · ",
								Math.floor(item.progressSeconds / 60),
								"m"
							]
						})]
					}, item.episodeId))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
					title: t("favorites"),
					items: data.favorites
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
					title: t("watchlist"),
					items: data.watchlist
				})
			]
		})
	] });
}
function Shelf({ title, items }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mb-3 text-xl font-extrabold",
		children: title
	}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: t("empty")
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-3 overflow-x-auto",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimeCard, { item }, item.id))
	})] });
}
//#endregion
export { LibraryPage as component };
