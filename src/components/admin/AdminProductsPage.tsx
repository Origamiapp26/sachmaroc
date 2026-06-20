"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ProductImage from "@/components/ProductImage";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const ready = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }, []);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.id.includes(q)
    );
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`متأكد بغيتي تحذف "${name}"؟`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) load();
    else alert("ما قدرناش نحذفو المنتج");
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white">المنتجات</h1>
          <p className="mt-1 text-sm text-ink-muted">{products.length} منتج</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800 dark:bg-whatsapp"
        >
          + إضافة منتج
        </Link>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-neutral-200 px-5 py-3 text-sm font-medium dark:border-neutral-700">
          استيراد JSON
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              const data = JSON.parse(text);
              const res = await fetch("/api/admin/products/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
              if (res.ok) load();
              else alert("وقع خطأ فالاستيراد");
            }}
          />
        </label>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="بحث بالاسم، الفئة، أو الرقم..."
        className="mt-6 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
      />

      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 md:block">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-ink-muted dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-3 text-right font-medium">المنتج</th>
              <th className="px-4 py-3 text-right font-medium">الفئة</th>
              <th className="px-4 py-3 text-right font-medium">الثمن</th>
              <th className="px-4 py-3 text-right font-medium">الحالة</th>
              <th className="px-4 py-3 text-right font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filtered.map((product) => (
              <tr key={product.id} className="bg-white dark:bg-neutral-900">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-ink dark:text-white">{product.name}</p>
                      <p className="text-xs text-ink-muted">#{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{product.category}</td>
                <td className="px-4 py-3 font-medium text-ink dark:text-white">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.featured && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        مميز
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        product.inStock
                          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                      }`}
                    >
                      {product.inStock ? "متوفر" : "نفد"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium dark:bg-neutral-800"
                    >
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 dark:bg-red-950"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink dark:text-white">{product.name}</p>
                <p className="text-xs text-ink-muted">{product.category}</p>
                <p className="mt-1 font-medium">{formatPrice(product.price)}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex-1 rounded-lg bg-neutral-100 py-2 text-center text-xs font-medium dark:bg-neutral-800"
              >
                تعديل
              </Link>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                disabled={deletingId === product.id}
                className="flex-1 rounded-lg bg-red-50 py-2 text-xs font-medium text-red-600 dark:bg-red-950"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-ink-muted">ما لقينا حتى منتج</p>
      )}
    </AdminShell>
  );
}
