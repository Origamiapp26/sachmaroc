"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface CategoryStat {
  name: string;
  count: number;
}

export default function AdminCategoriesPage() {
  const ready = useAdminAuth();
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(
      data.map((c: { name: string; productCount: number }) => ({
        name: c.name,
        count: c.productCount,
      }))
    );
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  const saveRename = async (oldName: string) => {
    if (!newName.trim() || newName.trim() === oldName) {
      setEditing(null);
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/categories/${encodeURIComponent(oldName)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    setSaving(false);

    if (res.ok) {
      setEditing(null);
      load();
    } else {
      const data = await res.json();
      alert(data.error || "وقع خطأ");
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-muted">
        كيتحمّل...
      </div>
    );
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">الفئات</h1>
      <p className="mt-1 text-sm text-ink-muted">
        الفئات كتولّد من المنتجات. تقدر تعاود تسميها هنا.
      </p>

      <div className="mt-6 space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              {editing === cat.name ? (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  autoFocus
                />
              ) : (
                <p className="font-bold text-ink dark:text-white">{cat.name}</p>
              )}
              <p className="text-xs text-ink-muted">{cat.count} منتج</p>
            </div>

            <div className="flex gap-2">
              {editing === cat.name ? (
                <>
                  <button
                    onClick={() => saveRename(cat.name)}
                    disabled={saving}
                    className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white dark:bg-whatsapp"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="rounded-lg border px-4 py-2 text-xs dark:border-neutral-700"
                  >
                    إلغاء
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditing(cat.name);
                    setNewName(cat.name);
                  }}
                  className="rounded-lg bg-neutral-100 px-4 py-2 text-xs font-medium dark:bg-neutral-800"
                >
                  إعادة تسمية
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="mt-8 text-center text-ink-muted">ما كاين حتى فئة — زيد منتج أولاً</p>
      )}
    </AdminShell>
  );
}
