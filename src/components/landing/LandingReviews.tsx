"use client";

import type { Testimonial } from "@/types/settings";

export default function LandingReviews({ reviews }: { reviews: Testimonial[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-whatsapp">آراء الزبناء</p>
          <h2 className="mt-2 text-2xl font-bold text-ink dark:text-white sm:text-3xl">
            شنو كيقولو علينا
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-2 text-amber-400 text-sm">{"★".repeat(t.rating)}</div>
              <p className="text-sm leading-relaxed text-ink-muted">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-neutral-800">
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
