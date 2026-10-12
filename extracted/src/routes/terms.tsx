import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "الشروط — كارتيفاي أنمي" }] }),
  component: () => (
    <SiteShell>
      <article className="panel max-w-3xl space-y-3 p-6 text-sm leading-7">
        <h1 className="text-3xl font-extrabold">شروط الاستخدام</h1>
        <p>المنصة أداة اكتشاف. حقوق الأعمال تعود لأصحابها. لا يُسمح بإضافة مصادر تشغيل غير مرخّصة، ولا باستخدام المنصة لتجاوز حماية المحتوى.</p>
        <p>التقييمات وعدد الحلقات والحالة معلومات وصفية من المزود وقد تتغير. كارتيفاي لا تدّعي أنها جهة البث الرسمية إلا عندما يربط المدير مصدراً مؤكداً.</p>
        <p>يمكن إيقاف الحساب عند إساءة الاستخدام. الاستمرار في استخدام المنصة يعني قبول هذه الشروط.</p>
      </article>
    </SiteShell>
  ),
});
