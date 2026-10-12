import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { submitContact } from "@/lib/anime/fns";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "تواصل — كارتيفاي أنمي" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submitContact({ data: { name, email, message } })
      .then(() => {
        setMessage("");
        toast.success("وصلت الرسالة");
      })
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Error"));
  }
  return (
    <SiteShell>
      <form className="panel mx-auto max-w-xl space-y-3 p-6" onSubmit={onSubmit}>
        <h1 className="text-3xl font-extrabold">تواصل</h1>
        <input className="field" required value={name} onChange={(event) => setName(event.target.value)} placeholder="الاسم" />
        <input className="field" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="البريد" />
        <textarea className="field min-h-32 py-2" required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="الرسالة" />
        <button className="btn btn-primary" type="submit">إرسال</button>
      </form>
    </SiteShell>
  );
}
