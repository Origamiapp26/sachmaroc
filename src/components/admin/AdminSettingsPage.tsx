"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type {
  StoreSettings,
  HeroSlide,
  TrustBarItem,
  Testimonial,
  HomepageSectionConfig,
} from "@/types/settings";
import type { Product } from "@/types/product";

export default function AdminSettingsPage() {
  const ready = useAdminAuth();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [sheetsTest, setSheetsTest] = useState<string>("");

  useEffect(() => {
    if (!ready) return;
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([s, p]) => {
      setSettings(s);
      setProducts(p);
    });
  }, [ready]);

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  };

  const updateHomepage = (key: keyof StoreSettings["homepage"], value: HomepageSectionConfig) => {
    setSettings((s) =>
      s ? { ...s, homepage: { ...s.homepage, [key]: value } } : s
    );
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setMessage(res.ok ? "تم الحفظ ✓" : "وقع خطأ");
    setTimeout(() => setMessage(""), 3000);
  };

  const addHeroSlide = () => {
    if (!settings || settings.heroSlides.length >= 5) return;
    const firstProduct = products[0];
    if (!firstProduct) return;
    update("heroSlides", [...settings.heroSlides, { productId: firstProduct.id }]);
  };

  const updateHeroSlide = (index: number, data: Partial<HeroSlide>) => {
    if (!settings) return;
    const slides = [...settings.heroSlides];
    slides[index] = { ...slides[index], ...data };
    update("heroSlides", slides);
  };

  const removeHeroSlide = (index: number) => {
    if (!settings) return;
    update("heroSlides", settings.heroSlides.filter((_, i) => i !== index));
  };

  const updateTrustItem = (index: number, data: Partial<TrustBarItem>) => {
    if (!settings) return;
    const items = [...settings.trustBar];
    items[index] = { ...items[index], ...data };
    update("trustBar", items);
  };

  const addTestimonial = () => {
    if (!settings) return;
    update("testimonials", [
      ...settings.testimonials,
      {
        id: String(Date.now()),
        name: "",
        city: "",
        rating: 5,
        text: "",
      },
    ]);
  };

  const updateTestimonial = (index: number, data: Partial<Testimonial>) => {
    if (!settings) return;
    const list = [...settings.testimonials];
    list[index] = { ...list[index], ...data };
    update("testimonials", list);
  };

  const removeTestimonial = (index: number) => {
    if (!settings) return;
    update("testimonials", settings.testimonials.filter((_, i) => i !== index));
  };

  if (!ready || !settings) {
    return <div className="flex min-h-screen items-center justify-center text-ink-muted">كيتحمّل...</div>;
  }

  const sectionKeys = [
    { key: "bestSellers" as const, label: "الأكثر مبيعاً" },
    { key: "newArrivals" as const, label: "وافدات جديدة" },
    { key: "reviews" as const, label: "آراء الزبناء" },
    { key: "categories" as const, label: "الفئات" },
    { key: "featured" as const, label: "منتجات مميزة" },
  ];

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">إعدادات المتجر</h1>
      <p className="mt-1 text-sm text-ink-muted">كل الصفحة الرئيسية كتتحكم من هنا → data/settings.json</p>

      <div className="mt-8 max-w-3xl space-y-8">
        {/* Hero Slider */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">سلايدر الصفحة الرئيسية (5 منتجات كحد أقصى)</h2>
            <button
              type="button"
              onClick={addHeroSlide}
              disabled={settings.heroSlides.length >= 5}
              className="rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
            >
              + إضافة شريحة
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {settings.heroSlides.map((slide, i) => (
              <div key={i} className="rounded-xl border border-neutral-100 p-4 dark:border-neutral-800">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">شريحة {i + 1}</span>
                  <button onClick={() => removeHeroSlide(i)} className="text-xs text-red-500">حذف</button>
                </div>
                <select
                  value={slide.productId}
                  onChange={(e) => updateHeroSlide(i, { productId: e.target.value })}
                  className="mb-2 w-full rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  placeholder="عنوان مخصص (اختياري)"
                  value={slide.title || ""}
                  onChange={(e) => updateHeroSlide(i, { title: e.target.value })}
                  className="mb-2 w-full rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
                <textarea
                  placeholder="وصف قصير (اختياري)"
                  value={slide.shortDescription || ""}
                  onChange={(e) => updateHeroSlide(i, { shortDescription: e.target.value })}
                  rows={2}
                  className="mb-2 w-full rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
                <ImageUploader
                  label="صورة مخصصة (اختياري)"
                  value={slide.image || ""}
                  onChange={(url) => updateHeroSlide(i, { image: url })}
                />
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input
                    placeholder='زر "اطلب الآن"'
                    value={slide.ctaOrder || ""}
                    onChange={(e) => updateHeroSlide(i, { ctaOrder: e.target.value })}
                    className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                  <input
                    placeholder='زر "شاهد التفاصيل"'
                    value={slide.ctaDetails || ""}
                    onChange={(e) => updateHeroSlide(i, { ctaDetails: e.target.value })}
                    className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>
            ))}
            {settings.heroSlides.length === 0 && (
              <p className="text-sm text-ink-muted">زيد شريحة واختار منتج</p>
            )}
          </div>
        </section>

        {/* Trust Bar */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">شريط الثقة (تحت الهيرو)</h2>
          <div className="mt-4 space-y-3">
            {settings.trustBar.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={item.icon}
                  onChange={(e) => updateTrustItem(i, { icon: e.target.value })}
                  className="w-16 rounded-xl border px-2 py-2 text-center text-lg dark:border-neutral-700 dark:bg-neutral-800"
                  placeholder="🚚"
                />
                <input
                  value={item.text}
                  onChange={(e) => updateTrustItem(i, { text: e.target.value })}
                  className="flex-1 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Homepage Sections */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">أقسام الصفحة الرئيسية</h2>
          <div className="mt-4 space-y-4">
            {sectionKeys.map(({ key, label }) => {
              const section = settings.homepage[key];
              return (
                <div key={key} className="rounded-xl border border-neutral-100 p-4 dark:border-neutral-800">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) =>
                        updateHomepage(key, { ...section, enabled: e.target.checked })
                      }
                    />
                    {label}
                  </label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input
                      placeholder="العنوان الفرعي"
                      value={section.subtitle}
                      onChange={(e) =>
                        updateHomepage(key, { ...section, subtitle: e.target.value })
                      }
                      className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                    />
                    <input
                      placeholder="العنوان الرئيسي"
                      value={section.title}
                      onChange={(e) =>
                        updateHomepage(key, { ...section, title: e.target.value })
                      }
                      className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">آراء الزبناء</h2>
            <button onClick={addTestimonial} className="rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white dark:bg-whatsapp">
              + إضافة
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {settings.testimonials.map((t, i) => (
              <div key={t.id} className="rounded-xl border p-4 dark:border-neutral-800">
                <div className="mb-2 flex justify-end">
                  <button onClick={() => removeTestimonial(i)} className="text-xs text-red-500">حذف</button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input placeholder="الاسم" value={t.name} onChange={(e) => updateTestimonial(i, { name: e.target.value })} className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
                  <input placeholder="المدينة" value={t.city} onChange={(e) => updateTestimonial(i, { city: e.target.value })} className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
                </div>
                <textarea placeholder="التعليق" value={t.text} onChange={(e) => updateTestimonial(i, { text: e.target.value })} rows={2} className="mt-2 w-full rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
                <input type="number" min={1} max={5} value={t.rating} onChange={(e) => updateTestimonial(i, { rating: Number(e.target.value) })} className="mt-2 w-20 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        </section>

        {/* General */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">التتبع والتحليلات</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs text-ink-muted">Facebook Pixel ID</label>
              <input
                placeholder="123456789012345"
                value={settings.facebookPixelId}
                onChange={(e) => update("facebookPixelId", e.target.value)}
                dir="ltr"
                className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-muted">Google Analytics 4 ID</label>
              <input
                placeholder="G-XXXXXXXXXX"
                value={settings.googleAnalyticsId}
                onChange={(e) => update("googleAnalyticsId", e.target.value)}
                dir="ltr"
                className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <p className="text-xs text-ink-muted">
              كيتفعّلو تلقائياً فالموقع: PageView، ViewContent، AddToCart، InitiateCheckout، Purchase
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">Google Sheets (API)</h2>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-ink-muted">
              الطلبات كتتزامن تلقائياً مع Google Sheets عبر Service Account.
              عيّن هاد المتغيرات فـ Vercel:
            </p>
            <ul className="list-inside list-disc space-y-1 text-xs text-ink-muted" dir="ltr">
              <li>GOOGLE_SHEET_ID</li>
              <li>GOOGLE_CLIENT_EMAIL</li>
              <li>GOOGLE_PRIVATE_KEY</li>
            </ul>
            <p className="text-xs text-ink-muted">
              SQLite كيبقى نسخة احتياطية محلية. شارك الـ Sheet مع client email ديال Service Account.
            </p>
            <button
              type="button"
              onClick={async () => {
                setSheetsTest("كيترسل الاختبار...");
                const res = await fetch("/api/admin/sheets", { method: "POST" });
                const data = await res.json();
                setSheetsTest(
                  data.ok
                    ? `✓ نجح — ${data.rowsWritten} صف(وف) (${data.durationMs}ms)`
                    : `✗ فشل: ${data.error || "unknown error"}`
                );
              }}
              className="rounded-lg border border-whatsapp/40 px-4 py-2 text-xs font-bold text-whatsapp"
            >
              اختبار Google Sheets API
            </button>
            {sheetsTest && (
              <p className={`text-xs ${sheetsTest.startsWith("✓") ? "text-whatsapp" : "text-red-500"}`}>
                {sheetsTest}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">معلومات عامة</h2>
          <div className="mt-4 space-y-4">
            <input placeholder="اسم المتجر" value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <input placeholder="واتساب (212...)" value={settings.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} dir="ltr" className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <ImageUploader label="الشعار" value={settings.logo} onChange={(url) => update("logo", url)} />
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">SEO</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="عنوان الموقع" value={settings.seo.defaultTitle} onChange={(e) => update("seo", { ...settings.seo, defaultTitle: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <textarea placeholder="وصف الموقع" value={settings.seo.defaultDescription} onChange={(e) => update("seo", { ...settings.seo, defaultDescription: e.target.value })} rows={2} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
          </div>
        </section>

        {message && <p className="text-sm text-whatsapp">{message}</p>}

        <button onClick={save} disabled={saving} className="rounded-xl bg-ink px-8 py-3 text-sm font-bold text-white dark:bg-whatsapp">
          {saving ? "كيتحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </AdminShell>
  );
}
