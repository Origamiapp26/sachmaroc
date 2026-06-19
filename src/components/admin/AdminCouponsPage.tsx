"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { Coupon } from "@/types/settings";

export default function AdminCouponsPage() {
  const ready = useAdminAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState<Coupon>({
    code: "",
    type: "percent",
    value: 10,
    active: true,
    minOrder: 200,
    expiresAt: "2027-12-31",
  });

  const load = () => fetch("/api/coupons").then((r) => r.json()).then(setCoupons);

  useEffect(() => {
    if (ready) load();
  }, [ready]);

  const add = async () => {
    await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    load();
    setForm({ ...form, code: "" });
  };

  const toggle = async (code: string, active: boolean) => {
    await fetch(`/api/coupons/${encodeURIComponent(code)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    load();
  };

  if (!ready) return <div className="flex min-h-screen items-center justify-center">كيتحمّل...</div>;

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">أكواد الخصم</h1>
      <p className="mt-1 text-sm text-ink-muted">كيتحفظو فـ data/coupons.json</p>

      <div className="mt-8 max-w-lg space-y-3 rounded-2xl border p-6 dark:border-neutral-800">
        <input placeholder="الكود" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full rounded-xl border px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" dir="ltr" />
        <div className="flex gap-2">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })} className="rounded-xl border px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800">
            <option value="percent">نسبة %</option>
            <option value="fixed">مبلغ ثابت</option>
          </select>
          <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="w-full rounded-xl border px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
        </div>
        <button onClick={add} className="w-full rounded-xl bg-ink py-2 text-sm font-bold text-white dark:bg-whatsapp">إضافة</button>
      </div>

      <div className="mt-6 space-y-3">
        {coupons.map((c) => (
          <div key={c.code} className="flex items-center justify-between rounded-xl border p-4 dark:border-neutral-800">
            <div>
              <p className="font-bold" dir="ltr">{c.code}</p>
              <p className="text-xs text-ink-muted">{c.type === "percent" ? `${c.value}%` : `${c.value} د.م`} — حد أدنى {c.minOrder} د.م</p>
            </div>
            <button onClick={() => toggle(c.code, !c.active)} className={`rounded-lg px-3 py-1 text-xs ${c.active ? "bg-green-100 text-green-800" : "bg-neutral-100"}`}>
              {c.active ? "نشط" : "معطل"}
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
