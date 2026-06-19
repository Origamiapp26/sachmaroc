"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "خطأ فالدخول");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-card dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h1 className="text-xl font-bold text-ink dark:text-white">SachMaroc Admin</h1>
        <p className="mt-1 text-sm text-ink-muted">دخل لمتابعة المتجر</p>

        <label className="mt-6 block text-xs font-medium text-ink-muted">اسم المستخدم</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          required
        />

        <label className="mt-4 block text-xs font-medium text-ink-muted">كلمة السر</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          required
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-ink py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-whatsapp dark:hover:bg-whatsapp-dark"
        >
          {loading ? "كيدخل..." : "دخول"}
        </button>

        <Link href="/" className="mt-4 block text-center text-sm text-ink-muted hover:text-ink">
          ← رجع للموقع
        </Link>
      </form>
    </div>
  );
}
