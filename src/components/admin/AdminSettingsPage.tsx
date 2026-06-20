"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { StoreSettings } from "@/types/settings";

export default function AdminSettingsPage() {
  const ready = useAdminAuth();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!ready) return;
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, [ready]);

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
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

  if (!ready || !settings) {
    return <div className="flex min-h-screen items-center justify-center text-ink-muted">كيتحمّل...</div>;
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">إعدادات المتجر</h1>
      <p className="mt-1 text-sm text-ink-muted">التغييرات كتتحفظ فـ data/settings.json</p>

      <div className="mt-8 max-w-3xl space-y-8">
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">معلومات عامة</h2>
          <div className="mt-4 space-y-4">
            <input placeholder="اسم المتجر" value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <input placeholder="واتساب (212...)" value={settings.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} dir="ltr" className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <ImageUploader label="الشعار" value={settings.logo} onChange={(url) => update("logo", url)} />
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">التواصل</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="البريد" value={settings.contact.email} onChange={(e) => update("contact", { ...settings.contact, email: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <input placeholder="الهاتف" value={settings.contact.phone} onChange={(e) => update("contact", { ...settings.contact, phone: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <input placeholder="العنوان" value={settings.contact.address} onChange={(e) => update("contact", { ...settings.contact, address: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">الصفحة الرئيسية (Hero)</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="الشارة" value={settings.hero.badge} onChange={(e) => update("hero", { ...settings.hero, badge: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <input placeholder="العنوان" value={settings.hero.title} onChange={(e) => update("hero", { ...settings.hero, title: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <input placeholder="العنوان المميز" value={settings.hero.titleHighlight} onChange={(e) => update("hero", { ...settings.hero, titleHighlight: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <textarea placeholder="الوصف" value={settings.hero.subtitle} onChange={(e) => update("hero", { ...settings.hero, subtitle: e.target.value })} rows={2} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <ImageUploader label="صورة Hero" value={settings.hero.image} onChange={(url) => update("hero", { ...settings.hero, image: url })} />
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold">التوصيل</h2>
          <div className="mt-4 space-y-3">
            <input placeholder="عنوان القسم" value={settings.delivery.title} onChange={(e) => update("delivery", { ...settings.delivery, title: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
            <textarea placeholder="الوصف" value={settings.delivery.description} onChange={(e) => update("delivery", { ...settings.delivery, description: e.target.value })} rows={2} className="w-full rounded-xl border px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
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
