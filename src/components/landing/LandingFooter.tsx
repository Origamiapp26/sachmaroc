"use client";

import { useSettings } from "@/context/SettingsContext";

export default function LandingFooter() {
  const { storeName } = useSettings();

  return (
    <footer className="border-t border-neutral-100 bg-neutral-50 py-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-xs font-semibold text-ink dark:text-white">
          💵 الدفع عند الاستلام · 🚚 توصيل لجميع المدن
        </p>
        <p className="mt-2 text-[10px] text-ink-muted">
          © {new Date().getFullYear()} {storeName} — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
