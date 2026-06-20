"use client";

import { useState } from "react";
import type { LandingFAQItem } from "@/types/product";

export default function LandingFAQ({ items }: { items: LandingFAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-neutral-50 py-10 dark:bg-neutral-900/50 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-whatsapp">أسئلة شائعة</p>
          <h2 className="mt-2 text-2xl font-bold text-ink dark:text-white sm:text-3xl">
            عندك سؤال؟
          </h2>
        </div>
        <div className="space-y-2">
          {items.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-right sm:px-5"
              >
                <span className="text-sm font-bold text-ink dark:text-white">{faq.question}</span>
                <svg
                  className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-800 sm:px-5">
                  <p className="text-sm leading-relaxed text-ink-muted">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
