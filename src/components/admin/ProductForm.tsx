"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { slugify } from "@/lib/slug";
import type { Product, ProductInput, LandingBenefit, LandingFAQItem } from "@/types/product";
import { getLandingUrl } from "@/lib/product-urls";
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
        slug: product.slug ?? "",
        landing: product.landing,
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
      landing: form.landing,
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

  const updateLanding = (data: Partial<NonNullable<ProductInput["landing"]>>) => {
    setForm((prev) => ({
      ...prev,
      landing: { ...prev.landing, ...data },
    }));
  };

  const updateBenefit = (index: number, data: Partial<LandingBenefit>) => {
    const list = [...(form.landing?.benefits ?? [])];
    list[index] = { ...list[index], ...data };
    updateLanding({ benefits: list });
  };

  const addBenefit = () => {
    const list = [...(form.landing?.benefits ?? []), { icon: "✓", title: "", text: "" }];
    updateLanding({ benefits: list });
  };

  const removeBenefit = (index: number) => {
    updateLanding({
      benefits: (form.landing?.benefits ?? []).filter((_, i) => i !== index),
    });
  };

  const updateFaq = (index: number, data: Partial<LandingFAQItem>) => {
    const list = [...(form.landing?.faq ?? [])];
    list[index] = { ...list[index], ...data };
    updateLanding({ faq: list });
  };

  const addFaq = () => {
    const list = [...(form.landing?.faq ?? []), { question: "", answer: "" }];
    updateLanding({ faq: list });
  };

  const removeFaq = (index: number) => {
    updateLanding({
      faq: (form.landing?.faq ?? []).filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-ink-muted">رابط صفحة الهبوط (slug)</label>
          <input
            value={form.slug ?? ""}
            onChange={(e) => update("slug", e.target.value)}
            dir="ltr"
            placeholder="jalaba-fakhra"
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
          <p className="mt-1 text-xs text-ink-muted">
            /landing/{form.slug || slugify(form.name) || "..."}
            {product && (
              <span className="ms-2 text-whatsapp">
                → {getLandingUrl({ ...product, slug: form.slug || product.slug })}
              </span>
            )}
          </p>
        </div>

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

      {/* Landing page — Facebook Ads */}
      <div className="rounded-2xl border border-whatsapp/20 bg-whatsapp-light/10 p-5 dark:border-whatsapp/30 dark:bg-whatsapp/5">
        <h2 className="text-base font-bold text-ink dark:text-white">صفحة الهبوط (Facebook Ads)</h2>
        <p className="mt-1 text-xs text-ink-muted">
          محتوى مخصص لـ /landing/{form.slug || slugify(form.name) || "..."} — بلا تنقل أو منتجات أخرى
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted">عنوان قوي (headline)</label>
            <input
              value={form.landing?.headline ?? ""}
              onChange={(e) => updateLanding({ headline: e.target.value })}
              placeholder={form.name || "عنوان يجذب الانتباه"}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted">وصف قصير (subheadline)</label>
            <textarea
              value={form.landing?.subheadline ?? ""}
              onChange={(e) => updateLanding({ subheadline: e.target.value })}
              rows={2}
              placeholder="جملة واحدة تقنع الزبون يطلب دابا"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-ink-muted">المزايا (3-6)</label>
              <button type="button" onClick={addBenefit} className="text-xs font-bold text-whatsapp">
                + إضافة
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {(form.landing?.benefits ?? []).map((b, i) => (
                <div key={i} className="flex gap-2 rounded-xl border p-3 dark:border-neutral-700">
                  <input
                    value={b.icon}
                    onChange={(e) => updateBenefit(i, { icon: e.target.value })}
                    className="w-12 rounded-lg border px-1 py-2 text-center dark:border-neutral-600 dark:bg-neutral-800"
                    placeholder="🚚"
                  />
                  <input
                    value={b.title}
                    onChange={(e) => updateBenefit(i, { title: e.target.value })}
                    placeholder="العنوان"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                  <input
                    value={b.text}
                    onChange={(e) => updateBenefit(i, { text: e.target.value })}
                    placeholder="الوصف"
                    className="flex-[2] rounded-lg border px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                  <button type="button" onClick={() => removeBenefit(i)} className="text-xs text-red-500">
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-ink-muted">الأسئلة الشائعة (FAQ)</label>
              <button type="button" onClick={addFaq} className="text-xs font-bold text-whatsapp">
                + إضافة
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {(form.landing?.faq ?? []).map((f, i) => (
                <div key={i} className="rounded-xl border p-3 dark:border-neutral-700">
                  <input
                    value={f.question}
                    onChange={(e) => updateFaq(i, { question: e.target.value })}
                    placeholder="السؤال"
                    className="mb-2 w-full rounded-lg border px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                  <textarea
                    value={f.answer}
                    onChange={(e) => updateFaq(i, { answer: e.target.value })}
                    placeholder="الجواب"
                    rows={2}
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                  <button type="button" onClick={() => removeFaq(i)} className="mt-1 text-xs text-red-500">
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
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
