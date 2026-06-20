"use client";

import { useSettings } from "@/context/SettingsContext";

export default function TestimonialsSection() {
  const { testimonials, homepage } = useSettings();
  if (testimonials.length === 0 || !homepage.reviews.enabled) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">
            {homepage.reviews.subtitle}
          </p>
          <h2 className="text-3xl font-bold text-ink dark:text-white">
            {homepage.reviews.title}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-card dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-3 text-amber-400">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <p className="text-sm font-bold text-ink dark:text-white">{t.name}</p>
                <p className="text-xs text-ink-faint">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
