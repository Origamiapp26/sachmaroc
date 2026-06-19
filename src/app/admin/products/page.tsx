"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types/product";

const emptyForm = {
  name: "",
  tagline: "",
  description: "",
  price: 0,
  originalPrice: undefined as number | undefined,
  categoryId: "",
  image: "",
  images: [] as string[],
  badge: "",
  stockQuantity: 10,
  featured: false,
  inStock: true,
  features: [] as string[],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [featuresText, setFeaturesText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setProducts(p);
    setCategories(c);
    if (c.length && !form.categoryId) setForm((f) => ({ ...f, categoryId: c[0].id }));
  }, [form.categoryId]);

  useEffect(() => { load(); }, [load]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setForm((f) => ({
        ...f,
        image: f.image || data.url,
        images: [...f.images, data.url],
      }));
    }
    return data.url;
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setFeaturesText("");
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
    setForm({
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      categoryId: p.categoryId,
      image: p.image,
      images: p.images,
      badge: p.badge || "",
      stockQuantity: p.stockQuantity,
      featured: p.featured,
      inStock: p.inStock,
      features: p.features,
    });
    setFeaturesText(p.features.join("\n"));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      features: featuresText.split("\n").filter(Boolean),
      images: form.images.length ? form.images : [form.image],
      originalPrice: form.originalPrice || undefined,
      badge: form.badge || undefined,
    };

    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage(editing ? "تم التحديث" : "تم الإضافة");
      setShowForm(false);
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("متأكد؟")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink dark:text-white">المنتجات</h1>
        <button onClick={openCreate} className="rounded-xl bg-whatsapp px-4 py-2 text-sm font-bold text-white">
          + منتج جديد
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-whatsapp">{message}</p>}

      {showForm && (
        <form onSubmit={save} className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold text-ink dark:text-white">{editing ? "تعديل" : "منتج جديد"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input placeholder="الاسم *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="number" placeholder="السعر" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
            <input type="number" placeholder="المخزون" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <input placeholder="رابط الصورة" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="col-span-2 rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" dir="ltr" />
            <div className="col-span-2">
              <label className="text-xs text-ink-muted">رفع صورة</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} className="mt-1 text-sm" />
              {uploading && <span className="text-xs text-ink-muted"> كيترفع...</span>}
            </div>
            <textarea placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="col-span-2 rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" required />
            <textarea placeholder="المميزات (سطر لكل ميزة)" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={2} className="col-span-2 rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <label className="flex items-center gap-2 text-sm dark:text-white">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              منتج مميز
            </label>
            <label className="flex items-center gap-2 text-sm dark:text-white">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
              متوفر
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-xl bg-ink px-6 py-2 text-sm font-bold text-white dark:bg-whatsapp">حفظ</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-6 py-2 text-sm dark:border-neutral-700 dark:text-white">إلغاء</button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800">
            <tr>
              <th className="p-3 text-right font-bold dark:text-white">المنتج</th>
              <th className="p-3 text-right font-bold dark:text-white">السعر</th>
              <th className="p-3 text-right font-bold dark:text-white">المخزون</th>
              <th className="p-3 text-right font-bold dark:text-white">مميز</th>
              <th className="p-3 text-right font-bold dark:text-white">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b dark:border-neutral-800">
                <td className="flex items-center gap-2 p-3">
                  <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="dark:text-white">{p.name}</span>
                </td>
                <td className="p-3 dark:text-neutral-300">{formatPrice(p.price)}</td>
                <td className="p-3 dark:text-neutral-300">{p.stockQuantity}</td>
                <td className="p-3">{p.featured ? "⭐" : "—"}</td>
                <td className="p-3">
                  <button onClick={() => openEdit(p)} className="ml-2 text-xs text-blue-600">تعديل</button>
                  <button onClick={() => remove(p.id)} className="text-xs text-red-500">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
