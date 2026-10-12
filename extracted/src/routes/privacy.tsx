import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "الخصوصية — كارتيفاي أنمي" }] }),
  component: () => (
    <SiteShell>
      <article className="panel max-w-3xl space-y-3 p-6 text-sm leading-7">
        <h1 className="text-3xl font-extrabold">الخصوصية</h1>
        <p>الحساب يحفظ الاسم والبريد الذي تستخدمه لتسجيل الدخول، وصورة اختيارية، وتفضيل اللغة. المفضلة وقائمة المشاهدة وتقدّم المشاهدة مرتبطة بحسابك ولا تُعرض للزوار.</p>
        <p>رسائل التواصل تُحفظ ليقرأها المدير، وتتضمن الاسم والبريد ونص الرسالة.</p>
        <p>لا نبيع هذه البيانات. كلمات المرور تُدار عبر نظام الحسابات ولا تظهر في لوحة الإدارة.</p>
        <p>بيانات الأنمي العامة مصدرها AniList وقد تتضمن روابط لمواقع طرف ثالث تخضع لسياساتها.</p>
      </article>
    </SiteShell>
  ),
});
