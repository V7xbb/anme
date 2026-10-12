import { o as __toESM } from "./_runtime.mjs";
import { T as require_jsx_runtime, et as require_react, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { A as saveProgress, C as getProgress, I as useCurrentUserState, L as useI18n, l as displayTitle, r as SiteShell } from "./_ssr/site-shell-38quj5hE.mjs";
import { n as Route } from "./_ssr/router-DQajGQwF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_number-acw61NhL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Player({ source, poster, startAt, onProgress }) {
	const { t } = useI18n();
	const videoRef = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const progressRef = (0, import_react.useRef)(onProgress);
	progressRef.current = onProgress;
	const startRef = (0, import_react.useRef)(0);
	startRef.current = startAt ?? 0;
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video || !source || source.sourceType === "external") return;
		let cancelled = false;
		let detach;
		setError(null);
		setLoading(true);
		const onTime = () => {
			if (video.currentTime > 0) progressRef.current?.(Math.floor(video.currentTime), video.ended);
		};
		video.addEventListener("timeupdate", onTime);
		video.addEventListener("ended", onTime);
		const fail = () => {
			if (!cancelled) {
				setLoading(false);
				setError(source.sourceType === "hls" ? "HLS" : "media");
			}
		};
		video.addEventListener("error", fail);
		const jump = () => {
			if (startRef.current > 0 && video.currentTime < 1) video.currentTime = startRef.current;
		};
		if (source.sourceType === "mp4") {
			video.src = source.playbackUrl;
			video.addEventListener("loadedmetadata", jump, { once: true });
			setLoading(false);
		} else if (source.sourceType === "hls") {
			if (video.canPlayType("application/vnd.apple.mpegurl")) {
				video.src = source.playbackUrl;
				video.addEventListener("loadedmetadata", jump, { once: true });
				setLoading(false);
			} else import("./_libs/hls.js.mjs").then((n) => n.t).then(({ default: Hls }) => {
				if (cancelled) return;
				if (!Hls.isSupported()) {
					fail();
					return;
				}
				const hls = new Hls({ enableWorker: true });
				hls.loadSource(source.playbackUrl);
				hls.attachMedia(video);
				hls.on(Hls.Events.ERROR, (_event, data) => {
					if (data.fatal) fail();
				});
				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					jump();
					if (!cancelled) setLoading(false);
				});
				detach = () => hls.destroy();
			}).catch(fail);
		}
		return () => {
			cancelled = true;
			video.removeEventListener("timeupdate", onTime);
			video.removeEventListener("ended", onTime);
			video.removeEventListener("error", fail);
			detach?.();
		};
	}, [source]);
	if (!source || source.sourceType !== "mp4" && source.sourceType !== "hls") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "panel grid min-h-52 place-items-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold",
			children: t("noSource")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: t("noSourceAr")
		})] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative bg-black",
			children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute inset-x-0 top-3 text-center text-sm text-muted",
				children: t("loading")
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				poster: poster ?? void 0,
				controls: true,
				className: "aspect-video w-full",
				playsInline: true,
				children: source.subtitleUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("track", {
					kind: "subtitles",
					src: source.subtitleUrl,
					srcLang: source.subtitlesLanguage ?? "ar",
					label: source.subtitlesLanguage ?? "subtitles"
				}) : null
			})]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-4 text-sm text-danger",
			children: error === "HLS" ? "This browser cannot play the HLS source." : "Playback failed for this authorized source."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "px-4 py-3 text-sm text-muted",
			children: [
				source.providerName,
				source.language ? ` · ${source.language}` : "",
				source.isOfficial ? " · official" : ""
			]
		})]
	});
}
function WatchPage() {
	const data = Route.useLoaderData();
	const { t, locale } = useI18n();
	const { user } = useCurrentUserState();
	const playable = data.sources.filter((source) => source.sourceType === "mp4" || source.sourceType === "hls");
	const [sourceId, setSourceId] = (0, import_react.useState)(playable[0]?.id ?? "");
	const source = playable.find((item) => item.id === sourceId) ?? playable[0] ?? null;
	const [startAt, setStartAt] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!user || !data.episode) return;
		getProgress({ data: data.episode.id }).then((row) => setStartAt(row?.progressSeconds ?? 0)).catch(() => void 0);
	}, [user, data.episode]);
	const lastSent = (0, import_react.useRef)(0);
	const external = data.sources.filter((item) => item.sourceType === "external");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/anime/$slug",
				params: { slug: data.anime.slug },
				className: "font-bold text-accent",
				children: displayTitle(data.anime, locale)
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "mt-2 text-3xl font-extrabold",
			children: [
				t("episode"),
				" ",
				data.number,
				data.episode?.title ? ` — ${data.episode.title}` : ""
			]
		}),
		data.virtual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: t("virtualEpisode")
		}) : null,
		data.episode?.synopsis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-3xl whitespace-pre-wrap text-sm",
			children: data.episode.synopsis
		}) : null,
		data.anime.episodeDurationMinutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-xs text-muted",
			children: [
				"مدة الحلقة المعتادة حسب AniList: ",
				data.anime.episodeDurationMinutes,
				" دقيقة. ليست مدة هذا الملف."
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
				source,
				poster: data.episode?.thumbnailUrl,
				startAt,
				onProgress: (seconds, completed) => {
					if (!user || !data.episode) return;
					if (!completed && seconds - lastSent.current < 10) return;
					lastSent.current = seconds;
					saveProgress({ data: {
						episodeId: data.episode.id,
						seconds,
						completed
					} }).catch(() => void 0);
				}
			})
		}),
		playable.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: playable.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-ghost",
				onClick: () => setSourceId(item.id),
				children: item.providerName
			}, item.id))
		}) : null,
		external.length || data.links.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-extrabold",
				children: "روابط مشاهدة خارجية"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 space-y-2 text-sm",
				children: [external.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "font-bold text-accent",
					href: item.playbackUrl,
					target: "_blank",
					rel: "noreferrer noopener",
					children: item.providerName
				}) }, item.id)), data.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "font-bold text-accent",
					href: link.url,
					target: "_blank",
					rel: "noreferrer noopener",
					children: link.site
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ms-2 text-xs text-muted",
					children: link.confirmedByAdmin ? t("adminConfirmed") : t("externalNote")
				})] }, link.id))]
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex gap-2",
			children: [data.previous ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "btn btn-ghost",
				to: "/watch/$slug/$number",
				params: {
					slug: data.anime.slug,
					number: String(data.previous)
				},
				children: t("previous")
			}) : null, data.next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "btn btn-primary",
				to: "/watch/$slug/$number",
				params: {
					slug: data.anime.slug,
					number: String(data.next)
				},
				children: t("next")
			}) : null]
		})
	] });
}
//#endregion
export { WatchPage as component };
