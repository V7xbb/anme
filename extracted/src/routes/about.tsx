import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  component: () => (
    <SiteShell>
      <article className="panel max-w-3xl space-y-3 p-6">
        <h1 className="text-3xl font-extrabold">عن كارتيفاي أنمي</h1>
        <p>كارتيفاي أنمي منصة عربية لاكتشاف الأنمي. بيانات العناوين والصور والتقييمات تُجلب من واجهة AniList الرسمية وتُحفظ في قاعدة المنصة مع رقم المزود لمنع التكرار.</p>
        <p>لا تعني مزامنة عدد الحلقات أن الحلقة قابلة للتشغيل. التشغيل داخل المنصة يظهر فقط إذا أضاف المدير مصدراً وأكّد أن استخدامه مرخّص، ثم فعّله.</p>
        <p>روابط Crunchyroll وغيرها تُعرض كروابط خارجية عندما تصنّفها AniList كبث، مع توضيح أنها ليست تشغيلاً داخلياً موثّقاً من كارتيفاي.</p>
        <p>الدبلجة العربية أو المصرية لا تُستنتج. تظهر فقط إذا وثّقها المدير.</p>
      </article>
    </SiteShell>
  ),
  head: () => ({ meta: [{ title: "عن المنصة — كارتيفاي أنمي" }] }),
});
