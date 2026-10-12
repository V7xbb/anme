import { C as useNavigate, T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as blankSearch } from "./search-params-B3Zy_7CL.mjs";
import { L as useI18n, r as SiteShell } from "./site-shell-38quj5hE.mjs";
import { i as Route$13 } from "./router-DQajGQwF.mjs";
import { a as STATUSES, i as SORTS, n as FORMATS, t as AUDIO_FILTERS } from "./domain-C7YK6ubC.mjs";
import { t as AnimeCard } from "./media-B-j6820R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-Dqm2U3Qg.js
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage() {
	const data = Route$13.useLoaderData();
	const search = Route$13.useSearch();
	const navigate = useNavigate({ from: "/catalog" });
	const { t, genre, format, status } = useI18n();
	function update(patch) {
		navigate({ search: {
			...search,
			page: 1,
			...patch
		} });
	}
	const years = Array.from({ length: 40 }, (_, index) => String((/* @__PURE__ */ new Date()).getUTCFullYear() - index));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 text-3xl font-extrabold",
			children: t("catalog")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "panel mb-6 grid gap-3 p-4 md:grid-cols-3",
			onSubmit: (event) => event.preventDefault(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-bold",
					children: [t("searchPlaceholder"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						value: search.q,
						onChange: (event) => update({ q: event.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-bold",
					children: [t("genres"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field mt-1",
						value: search.genre,
						onChange: (event) => update({ genre: event.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: t("all")
						}), data.genres.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: genre(item)
						}, item))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-bold",
					children: [t("year"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field mt-1",
						value: search.year,
						onChange: (event) => update({ year: event.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: t("all")
						}), years.map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: year,
							children: year
						}, year))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-bold",
					children: [t("format"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field mt-1",
						value: search.format,
						onChange: (event) => update({ format: event.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: t("all")
						}), FORMATS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: format(item)
						}, item))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-bold",
					children: [t("status"), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field mt-1",
						value: search.status,
						onChange: (event) => update({ status: event.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: t("all")
						}), STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: status(item)
						}, item))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-bold",
					children: [t("sort"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "field mt-1",
						value: search.sort,
						onChange: (event) => update({ sort: event.target.value }),
						children: SORTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: item
						}, item))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm font-bold md:col-span-3",
					children: [t("audio"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "field mt-1",
						value: search.audio,
						onChange: (event) => update({ audio: event.target.value }),
						children: AUDIO_FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: item === "ar-sub" ? t("arabicSubs") : item === "ar-dub" ? t("arabicDub") : item === "eg-dub" ? t("egyptianDub") : t("all")
						}, item || "all"))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-muted",
			children: [
				data.total,
				" · ",
				t("page"),
				" ",
				data.page,
				" / ",
				data.pages
			]
		}),
		data.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold",
				children: t("empty")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/catalog",
				search: blankSearch,
				className: "btn btn-ghost mt-4",
				children: t("retry")
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
			children: data.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimeCard, {
				item,
				className: "w-full"
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-ghost",
				type: "button",
				disabled: search.page <= 1,
				onClick: () => update({ page: search.page - 1 }),
				children: t("previous")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-ghost",
				type: "button",
				disabled: search.page >= data.pages,
				onClick: () => update({ page: search.page + 1 }),
				children: t("next")
			})]
		})
	] });
}
//#endregion
export { CatalogPage as component };
