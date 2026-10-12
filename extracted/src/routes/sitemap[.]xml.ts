import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { getSql } = await import("@/lib/db");
        const sql = await getSql();
        const rows = await sql.query<{ slug: string }>("select slug from anime order by popularity desc nulls last limit 500");
        const urls = ["/", "/catalog", "/about", "/privacy", "/terms", "/contact", ...rows.map((row) => `/anime/${row.slug}`)];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((path) => `<url><loc>${origin}${path}</loc></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
