import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-params-B3Zy_7CL.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-IWHfIGH2.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-CECj3oyS.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var blankSearch = {
	q: "",
	page: 1,
	genre: "",
	year: "",
	format: "",
	status: "",
	sort: "popular",
	audio: ""
};
function readCatalogSearch(search) {
	const page = Number(search.page);
	return {
		q: typeof search.q === "string" ? search.q.slice(0, 80) : "",
		page: Number.isFinite(page) && page > 0 ? Math.min(500, Math.floor(page)) : 1,
		genre: typeof search.genre === "string" ? search.genre.slice(0, 40) : "",
		year: typeof search.year === "string" ? search.year.replace(/[^\d]/g, "").slice(0, 4) : "",
		format: typeof search.format === "string" ? search.format.slice(0, 16) : "",
		status: typeof search.status === "string" ? search.status.slice(0, 32) : "",
		sort: typeof search.sort === "string" ? search.sort.slice(0, 16) : "popular",
		audio: typeof search.audio === "string" ? search.audio.slice(0, 16) : ""
	};
}
//#endregion
export { blankSearch as n, readCatalogSearch as r, authMiddleware as t };
