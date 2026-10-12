import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "دخول — كارتيفاي أنمي" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = mode === "up"
      ? await authClient.signUp.email({ email, password, name: name || email.split("@")[0] || "مشاهد", callbackURL: "/" })
      : await authClient.signIn.email({ email, password, callbackURL: "/" });
    setPending(false);
    if (result.error) {
      setError(result.error.message || "تعذر الدخول");
      return;
    }
    void navigate({ to: "/" });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-4 text-fg">
      <div className="panel w-full max-w-md space-y-4 p-6">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-2xl font-extrabold">كارتيفاي أنمي</h1>
            <p className="text-sm text-muted">عالمك، قصتك، أنميك.</p>
          </div>
        </div>
        {authEnabled ? (
          <>
            <div className="grid gap-2">
              {GROK_PROVIDERS.map((provider) => (
                <button key={provider.providerId} type="button" className="btn btn-ghost w-full" onClick={() => signIn(provider.providerId, { callbackURL: "/" })}>
                  المتابعة عبر {provider.label}
                </button>
              ))}
            </div>
            <form className="space-y-3" onSubmit={onSubmit}>
              {mode === "up" ? (
                <input className="field" placeholder="الاسم" value={name} onChange={(event) => setName(event.target.value)} />
              ) : null}
              <input className="field" type="email" required placeholder="البريد" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
              <input className="field" type="password" required minLength={8} placeholder="كلمة المرور" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} />
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <button className="btn btn-primary w-full" type="submit" disabled={pending}>{pending ? "…" : mode === "up" ? "إنشاء حساب" : "دخول"}</button>
            </form>
            <button type="button" className="text-sm font-bold text-accent" onClick={() => setMode(mode === "up" ? "in" : "up")}>
              {mode === "up" ? "لدي حساب" : "حساب جديد"}
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">تسجيل الدخول غير مفعّل.</p>
        )}
      </div>
    </main>
  );
}
