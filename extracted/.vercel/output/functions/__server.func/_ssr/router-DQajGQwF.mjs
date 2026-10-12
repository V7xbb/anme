import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { $ as notFound, T as require_jsx_runtime, X as redirect, _ as Outlet, b as createRootRoute, et as require_react, f as Scripts, g as createRouter, p as HeadContent, v as lazyRouteComponent, w as useRouter, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as readCatalogSearch } from "./search-params-B3Zy_7CL.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-DWzvqhMl.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { _ as getCatalog, g as getAnime, r as SiteShell, t as LocaleProvider, v as getEpisode, y as getHome } from "./site-shell-38quj5hE.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DQajGQwF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error, reset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "تعذر إكمال الطلب"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			}),
			reset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-primary",
				onClick: () => reset(),
				children: "إعادة المحاولة"
			}) : null
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-vyHxVCLG.css";
var Route$18 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "كارتيفاي أنمي" },
			{
				name: "description",
				content: "كارتيفاي أنمي — اكتشف الأنمي والتفاصيل والروابط الرسمية. التشغيل داخل المنصة للمصادر المرخّصة فقط."
			},
			{
				name: "theme-color",
				content: "#070B15"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LocaleProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center"
			})] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$12 = () => import("./routes-ClTsTLj7.mjs");
var $$splitErrorComponentImporter = () => import("./routes-C8AILraC.mjs");
var Route$17 = createFileRoute("/")({
	loader: () => getHome(),
	head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.settings.brandNameAr ?? "كارتيفاي أنمي"} — KARTIFY ANIME` }, {
		name: "description",
		content: loaderData?.settings.taglineAr ?? "عالمك، قصتك، أنميك."
	}] }),
	pendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero skel rounded-3xl" }) }),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("../_-D-3RqE4L.mjs");
var Route$16 = createFileRoute("/$")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./about-WAfRk6w9.mjs");
var Route$15 = createFileRoute("/about")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [{ title: "عن المنصة — كارتيفاي أنمي" }] })
});
var $$splitComponentImporter$9 = () => import("./admin-39heY7gr.mjs");
var Route$14 = createFileRoute("/admin")({
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	head: () => ({ meta: [{ title: "الإدارة — كارتيفاي أنمي" }, {
		name: "robots",
		content: "noindex"
	}] })
});
var $$splitComponentImporter$8 = () => import("./catalog-Dqm2U3Qg.mjs");
var Route$13 = createFileRoute("/catalog")({
	validateSearch: (search) => readCatalogSearch(search),
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => getCatalog({ data: deps }),
	head: () => ({ meta: [{ title: "الكتالوج — كارتيفاي أنمي" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./contact-BY2jeVsR.mjs");
var Route$12 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "تواصل — كارتيفاي أنمي" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./library-CWnhDAvS.mjs");
var Route$11 = createFileRoute("/library")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "مكتبتي — كارتيفاي أنمي" }] })
});
var $$splitComponentImporter$5 = () => import("./login-DUrbN0Ms.mjs");
var Route$10 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "دخول — كارتيفاي أنمي" }] })
});
var $$splitComponentImporter$4 = () => import("./privacy-LP7GL4r9.mjs");
var Route$9 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "الخصوصية — كارتيفاي أنمي" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./profile-BM0Y20q8.mjs");
var Route$8 = createFileRoute("/profile")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "الحساب — كارتيفاي أنمي" }] })
});
var Route$7 = createFileRoute("/robots.txt")({ server: { handlers: { GET: () => new Response("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } }) } } });
var Route$6 = createFileRoute("/search")({
	validateSearch: (search) => readCatalogSearch(search),
	beforeLoad: ({ search }) => {
		throw redirect({
			to: "/catalog",
			search
		});
	}
});
var Route$5 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async ({ request }) => {
	const origin = new URL(request.url).origin;
	const { getSql } = await import("./db-D23WWzhe.mjs").then((n) => n.n).then((n) => n.n);
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
		"/",
		"/catalog",
		"/about",
		"/privacy",
		"/terms",
		"/contact",
		...(await (await getSql()).query("select slug from anime order by popularity desc nulls last limit 500")).map((row) => `/anime/${row.slug}`)
	].map((path) => `<url><loc>${origin}${path}</loc></url>`).join("\n")}\n</urlset>`;
	return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
} } } });
var $$splitComponentImporter$2 = () => import("./terms-Deqc6J9z.mjs");
var Route$4 = createFileRoute("/terms")({
	head: () => ({ meta: [{ title: "الشروط — كارتيفاي أنمي" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitNotFoundComponentImporter$1 = () => import("../_slug-CNya8YNk.mjs");
var $$splitComponentImporter$1 = () => import("../_slug-D_1ds3Ec.mjs");
var Route$3 = createFileRoute("/anime/$slug")({
	loader: async ({ params }) => {
		const data = await getAnime({ data: params.slug });
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData }) => ({
		meta: [{ title: loaderData ? `${loaderData.anime.englishTitle || loaderData.anime.title} — كارتيفاي أنمي` : "كارتيفاي أنمي" }, {
			name: "description",
			content: (loaderData?.anime.synopsis ?? "تفاصيل الأنمي").slice(0, 180)
		}],
		links: [{
			rel: "canonical",
			href: `/anime/${loaderData?.anime.slug ?? ""}`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
var Route$2 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route$1 = createFileRoute("/api/cron/sync")({ server: { handlers: { POST: async ({ request }) => {
	const secret = process.env.SYNC_SECRET;
	if (!secret) return Response.json({
		ok: false,
		error: "SYNC_SECRET is not configured, so scheduled sync is not active."
	}, { status: 503 });
	const header = request.headers.get("authorization") ?? "";
	const expected = `Bearer ${secret}`;
	const a = Buffer.from(header);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Forbidden", { status: 401 });
	const { syncFromAnilist } = await import("./repo.server-wmjKsdSa.mjs");
	const report = await syncFromAnilist({
		kind: "trending",
		markTrending: true
	});
	return Response.json(report);
} } } });
var $$splitNotFoundComponentImporter = () => import("../_number-Cvlp1YL3.mjs");
var $$splitComponentImporter = () => import("../_number-acw61NhL.mjs");
var Route = createFileRoute("/watch/$slug/$number")({
	loader: async ({ params }) => {
		const number = Number(params.number);
		const data = await getEpisode({ data: {
			slug: params.slug,
			number
		} });
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.anime.title} ${loaderData.number} — كارتيفاي أنمي` : "حلقة" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
var rootRouteChildren = {
	IndexRoute: Route$17.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$18
	}),
	SplatRoute: Route$16.update({
		id: "/$",
		path: "/$",
		getParentRoute: () => Route$18
	}),
	AboutRoute: Route$15.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$18
	}),
	AdminRoute: Route$14.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$18
	}),
	CatalogRoute: Route$13.update({
		id: "/catalog",
		path: "/catalog",
		getParentRoute: () => Route$18
	}),
	ContactRoute: Route$12.update({
		id: "/contact",
		path: "/contact",
		getParentRoute: () => Route$18
	}),
	LibraryRoute: Route$11.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$18
	}),
	LoginRoute: Route$10.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$18
	}),
	PrivacyRoute: Route$9.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$18
	}),
	ProfileRoute: Route$8.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$18
	}),
	RobotsDottxtRoute: Route$7.update({
		id: "/robots.txt",
		path: "/robots.txt",
		getParentRoute: () => Route$18
	}),
	SearchRoute: Route$6.update({
		id: "/search",
		path: "/search",
		getParentRoute: () => Route$18
	}),
	SitemapDotxmlRoute: Route$5.update({
		id: "/sitemap.xml",
		path: "/sitemap.xml",
		getParentRoute: () => Route$18
	}),
	TermsRoute: Route$4.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$18
	}),
	AnimeSlugRoute: Route$3.update({
		id: "/anime/$slug",
		path: "/anime/$slug",
		getParentRoute: () => Route$18
	}),
	ApiAuthSplatRoute: Route$2.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$18
	}),
	ApiCronSyncRoute: Route$1.update({
		id: "/api/cron/sync",
		path: "/api/cron/sync",
		getParentRoute: () => Route$18
	}),
	WatchSlugNumberRoute: Route.update({
		id: "/watch/$slug/$number",
		path: "/watch/$slug/$number",
		getParentRoute: () => Route$18
	})
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$17 as a, Route$13 as i, Route as n, Route$3 as r, router_exports as t };
