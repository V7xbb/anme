import { o as __toESM } from "./_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { I as useCurrentUserState, L as useI18n, N as toggleFavorite, P as toggleWatchlist, l as displayTitle, r as SiteShell, x as getMembership } from "./_ssr/site-shell-38quj5hE.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$3 } from "./_ssr/router-DQajGQwF.mjs";
import { g as scoreLabel } from "./_ssr/domain-C7YK6ubC.mjs";
import { r as Poster } from "./_ssr/media-B-j6820R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-D_1ds3Ec.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SaveButtons({ animeId }) {
	const { user, isPending } = useCurrentUserState();
	const { t } = useI18n();
	const [favorite, setFavorite] = (0, import_react.useState)(false);
	const [listed, setListed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMembership().then((row) => {
			setFavorite(row.favoriteIds.includes(animeId));
			setListed(row.watchlistIds.includes(animeId));
		}).catch(() => void 0);
	}, [user, animeId]);
	if (isPending) return null;
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "btn btn-ghost",
		children: t("signInNeeded")
	});
	async function run(kind) {
		try {
			if (kind === "favorite") setFavorite(await toggleFavorite({ data: animeId }));
			else setListed(await toggleWatchlist({ data: animeId }));
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Error");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn btn-primary",
			onClick: () => void run("favorite"),
			children: favorite ? t("saved") : t("addFavorite")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn btn-ghost",
			onClick: () => void run("watch"),
			children: listed ? t("listed") : t("watchlist")
		})]
	});
}
function AnimePage() {
	const { anime, episodes, seasons, links, related } = Route$3.useLoaderData();
	const { t, locale, genre, format, status } = useI18n();
	const title = displayTitle(anime, locale);
	const synopsis = locale === "ar" && anime.synopsisAr ? anime.synopsisAr : anime.synopsis;
	const score = scoreLabel(anime.rating);
	const numbers = episodes.map((episode) => episode.number);
	const virtualCount = anime.episodeCount && anime.episodeCount <= 48 ? anime.episodeCount : 0;
	const shown = new Set(numbers);
	const virtuals = virtualCount ? Array.from({ length: virtualCount }, (_, index) => index + 1).filter((n) => !shown.has(n)) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "grid gap-6 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "poster-frame panel overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Poster, {
					src: anime.posterUrl,
					alt: "",
					priority: true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-accent",
						children: anime.englishTitle && title !== anime.title ? anime.title : anime.originalTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-extrabold",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							format(anime.format),
							" · ",
							status(anime.airingStatus),
							" · ",
							anime.releaseYear ?? "—",
							anime.season ? ` · ${anime.season} ${anime.seasonYear ?? ""}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: score ? `${score} / 10 · ${t("ratingFrom")}` : t("noRating")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							t("episodesMeta"),
							": ",
							anime.episodeCount ?? "—",
							" · ",
							t("notPlayable")
						]
					}),
					anime.mainStudio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							t("studio"),
							": ",
							anime.mainStudio
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							t("origin"),
							": ",
							anime.dataOrigin === "admin" ? t("adminData") : `${t("provider")} · ${anime.provider} #${anime.providerId}`
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: anime.genres.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalog",
							search: {
								q: "",
								page: 1,
								genre: item,
								year: "",
								format: "",
								status: "",
								sort: "popular",
								audio: ""
							},
							className: "rounded-full border border-line px-3 py-1 text-sm",
							children: genre(item)
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageFlags, { anime }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButtons, { animeId: anime.id })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-extrabold",
					children: t("synopsis")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-sm leading-7",
					children: synopsis || t("empty")
				}),
				!anime.synopsisAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: t("synopsisNote")
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-2xl font-extrabold",
					children: t("episode")
				}),
				seasons.map((season) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-sm text-muted",
					children: [
						season.title,
						" · ",
						season.origin
					]
				}, season.id)),
				episodes.length === 0 && virtuals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: t("virtualEpisode")
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6",
					children: [episodes.map((episode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/watch/$slug/$number",
						params: {
							slug: anime.slug,
							number: String(episode.number)
						},
						className: "panel p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold",
							children: [
								t("episode"),
								" ",
								episode.number
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block truncate text-muted",
							children: episode.title || (episode.playable ? t("play") : t("noSourceAr"))
						})]
					}, episode.id)), virtuals.map((number) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/watch/$slug/$number",
						params: {
							slug: anime.slug,
							number: String(number)
						},
						className: "panel p-3 text-sm text-muted",
						children: [
							t("episode"),
							" ",
							number
						]
					}, number))]
				}),
				anime.episodeCount && anime.episodeCount > 48 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						t("episodesMeta"),
						": ",
						anime.episodeCount,
						". استخدم رقم الحلقة في الرابط حتى هذا العدد."
					]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-2xl font-extrabold",
					children: "روابط خارجية"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: t("externalNote")
				}),
				links.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: t("empty")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-bold text-accent",
						href: link.url,
						target: "_blank",
						rel: "noreferrer noopener",
						children: link.site
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ms-2 text-xs text-muted",
						children: link.confirmedByAdmin ? t("adminConfirmed") : t("externalNote")
					})] }, link.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-2xl font-extrabold",
				children: t("related")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2 sm:grid-cols-2",
				children: related.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "panel p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: item.relation
					}), item.slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/anime/$slug",
						params: { slug: item.slug },
						className: "mt-1 block font-bold",
						children: item.title
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block font-bold",
						children: item.title
					})]
				}, `${item.relation}-${item.providerId}`))
			})]
		})
	] });
}
function LanguageFlags({ anime }) {
	const { t } = useI18n();
	if (![
		anime.hasArabicSubs,
		anime.hasArabicDub,
		anime.hasEgyptianDub
	].some((flag) => flag != null)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: t("unverifiedLang")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "text-sm",
		children: [
			anime.hasArabicSubs === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("arabicSubs") }) : null,
			anime.hasArabicDub === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("arabicDub") }) : null,
			anime.hasEgyptianDub === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("egyptianDub") }) : null,
			anime.hasArabicSubs === false && anime.hasArabicDub === false && anime.hasEgyptianDub === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t("unverifiedLang") }) : null
		]
	});
}
//#endregion
export { AnimePage as component };
