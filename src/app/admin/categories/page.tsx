"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import type { Category } from "@/types/product";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [editing, setEditing] = useState<Category | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", image: "" });
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("متأكد؟")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">الفئات</h1>

      <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-900">
        <input placeholder="اسم الفئة" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
        <input placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
        <input placeholder="رابط الصورة" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" dir="ltr" />
        <button type="submit" className="rounded-xl bg-ink px-6 py-2.5 text-sm font-bold text-white dark:bg-whatsapp sm:col-span-3">
          {editing ? "تحديث" : "إضافة فئة"}
        </button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            {c.image && <img src={c.image} alt="" className="mb-3 h-24 w-full rounded-xl object-cover" />}
            <h3 className="font-bold text-ink dark:text-white">{c.name}</h3>
            <p className="mt-1 text-xs text-ink-muted">{c.description}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description, image: c.image }); }} className="text-xs text-blue-600">تعديل</button>
              <button onClick={() => remove(c.id)} className="text-xs text-red-500">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
