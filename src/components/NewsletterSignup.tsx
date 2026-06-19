"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMessage(data.message || "تم التسجيل!");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error || "وقع خطأ");
    }
  };

  return (
    <section className="border-t border-neutral-100 py-12 dark:border-neutral-800">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <h3 className="text-lg font-bold text-ink dark:text-white">اشترك فالنشرة الإخبارية</h3>
        <p className="mt-2 text-sm text-ink-muted">توصل بالعروض والمنتجات الجديدة</p>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            required
            dir="ltr"
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white dark:bg-whatsapp"
          >
            {status === "loading" ? "..." : "اشتراك"}
          </button>
        </form>
        {message && (
          <p className={`mt-2 text-sm ${status === "error" ? "text-red-500" : "text-whatsapp"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
