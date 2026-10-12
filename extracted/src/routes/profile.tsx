import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimPreviewAdmin, getMyProfile, updateProfile } from "@/lib/anime/fns";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "الحساب — كارتيفاي أنمي" }] }),
});

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const { t, setLocale } = useI18n();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [locale, setLoc] = useState("ar");
  const [role, setRole] = useState("user");
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    if (!user) return;
    getMyProfile()
      .then((profile) => {
        setName(profile.displayName);
        setAvatar(profile.avatarUrl ?? "");
        setLoc(profile.locale);
        setRole(profile.role);
        setPreview(profile.previewAdminAvailable);
        setLocale(profile.locale === "en" ? "en" : "ar");
      })
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }, [user, setLocale]);
  if (isPending) return <SiteShell><p>{t("loading")}</p></SiteShell>;
  if (!user) return <SiteShell><RedirectToSignIn /></SiteShell>;
  return (
    <SiteShell>
      <h1 className="mb-4 text-3xl font-extrabold">{t("profile")}</h1>
      <form
        className="panel max-w-xl space-y-3 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          updateProfile({ data: { displayName: name, avatarUrl: avatar, locale } })
            .then((profile) => {
              setRole(profile.role);
              setLocale(profile.locale === "en" ? "en" : "ar");
              toast.success("تم الحفظ");
            })
            .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
        }}
      >
        <p className="text-sm text-muted">{user.primaryEmail}</p>
        <p className="text-sm">الدور: {role}</p>
        <label className="block text-sm font-bold">الاسم
          <input className="field mt-1" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="block text-sm font-bold">صورة https
          <input className="field mt-1" value={avatar} onChange={(event) => setAvatar(event.target.value)} />
        </label>
        <label className="block text-sm font-bold">اللغة
          <select className="field mt-1" value={locale} onChange={(event) => setLoc(event.target.value)}>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </label>
        <button className="btn btn-primary" type="submit">حفظ</button>
      </form>
      <div className="mt-4"><UserButton /></div>
      {preview && role !== "admin" ? (
        <button
          className="btn btn-ghost mt-4"
          type="button"
          onClick={() => claimPreviewAdmin()
            .then((profile) => setRole(profile.role))
            .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"))}
        >
          تفعيل الإدارة في المعاينة المحلية
        </button>
      ) : null}
      {role === "suspended" ? <p className="mt-4 text-danger">الحساب موقوف.</p> : null}
    </SiteShell>
  );
}
