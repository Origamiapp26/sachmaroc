"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function NewProductPage() {
  const ready = useAdminAuth();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!ready) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.map((c: { name: string }) => c.name)));
  }, [ready]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-muted">
        كيتحمّل...
      </div>
    );
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">إضافة منتج جديد</h1>
      <p className="mt-1 text-sm text-ink-muted">
        المنتج كيتحفظ تلقائياً فـ products.json
      </p>
      <div className="mt-8 max-w-3xl rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
        <ProductForm categories={categories} />
      </div>
    </AdminShell>
  );
}
