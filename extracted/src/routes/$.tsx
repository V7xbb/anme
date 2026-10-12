import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/$")({
  component: () => (
    <SiteShell>
      <div className="panel p-10 text-center">
        <p className="text-sm text-muted">404</p>
        <h1 className="mt-2 text-3xl font-extrabold">الصفحة غير موجودة</h1>
        <Link to="/" className="btn btn-primary mt-6">الرئيسية</Link>
      </div>
    </SiteShell>
  ),
});
