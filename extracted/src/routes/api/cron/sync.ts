import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "node:crypto";

export const Route = createFileRoute("/api/cron/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.SYNC_SECRET;
        if (!secret) {
          return Response.json({ ok: false, error: "SYNC_SECRET is not configured, so scheduled sync is not active." }, { status: 503 });
        }
        const header = request.headers.get("authorization") ?? "";
        const expected = `Bearer ${secret}`;
        const a = Buffer.from(header);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Forbidden", { status: 401 });
        }
        const { syncFromAnilist } = await import("@/lib/anime/repo.server");
        const report = await syncFromAnilist({ kind: "trending", markTrending: true });
        return Response.json(report);
      },
    },
  },
});
