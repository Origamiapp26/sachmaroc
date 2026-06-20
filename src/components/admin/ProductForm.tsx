"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/lib/config";
import type { Product, ProductInput } from "@/types/product";
import { GalleryUploader, ImageUploader } from "./ImageUploader";

interface ProductFormProps {
  product?: Product;
  categories: string[];
  onSuccess?: () => void;
}

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  oldPrice: undefined,
  category: "",
  image: "",
  gallery: [],
  featured: false,
  inStock: true,
  whatsappNumber: WHATSAPP_NUMBER,
};

export default function ProductForm({
  product,
  categories,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [newCategory, setNewCategory] = useState("");
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        category: product.category,
        image: product.image,
        gallery: product.gallery ?? [],
        featured: product.featured,
        inStock: product.inStock,
        whatsappNumber: product.whatsappNumber,
        isBestSeller: product.isBestSeller ?? false,
        isNewArrival: product.isNewArrival ?? false,
      });
      setUseNewCategory(false);
    }
  }, [product]);

  const categoryOptions = categories.filter((c) => c !== "الكل");

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload: ProductInput = {
      ...form,
      category: useNewCategory ? newCategory.trim() : form.category,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      price: Number(form.price),
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "وقع خطأ فالحفظ");
      return;
    }

    onSuccess?.();
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-ink-muted">اسم المنتج *</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-ink-muted">الوصف *</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
            rows={4}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-muted">الثمن (MAD) *</label>
          <input
            type="number"
            min={0}
            value={form.price || ""}
            onChange={(e) => update("price", Number(e.target.value))}
            required
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-muted">الثمن القديم (اختياري)</label>
          <input
            type="number"
            min={0}
            value={form.oldPrice ?? ""}
            onChange={(e) =>
              update("oldPrice", e.target.value ? Number(e.target.value) : undefined)
            }
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-ink-muted">الفئة *</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={!useNewCategory}
                onChange={() => setUseNewCategory(false)}
              />
              فئة موجودة
            </label>
            {!useNewCategory && (
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                required={!useNewCategory}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="">اختار فئة</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={useNewCategory}
                onChange={() => setUseNewCategory(true)}
              />
              فئة جديدة
            </label>
            {useNewCategory && (
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="مثال: عطور"
                required={useNewCategory}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            label="الصورة الرئيسية *"
            value={form.image}
            onChange={(url) => update("image", url)}
            hint="ارفع صورة من جهازك أو الصق رابط"
          />
        </div>

        <div className="md:col-span-2">
          <GalleryUploader
            label="معرض الصور (اختياري)"
            value={form.gallery ?? []}
            onChange={(urls) => update("gallery", urls)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-muted">رقم واتساب</label>
          <input
            value={form.whatsappNumber}
            onChange={(e) => update("whatsappNumber", e.target.value)}
            dir="ltr"
            placeholder="212607674922"
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <div className="flex flex-col justify-end gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            منتج مميز (الصفحة الرئيسية)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.inStock} onChange={(e) => update("inStock", e.target.checked)} />
            متوفر فالمخزون
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(form.isBestSeller)} onChange={(e) => update("isBestSeller", e.target.checked)} />
            الأكثر مبيعاً
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(form.isNewArrival)} onChange={(e) => update("isNewArrival", e.target.checked)} />
            وافدة جديدة
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-whatsapp"
        >
          {saving ? "كيتحفظ..." : product ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-medium text-ink-muted dark:border-neutral-700"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
