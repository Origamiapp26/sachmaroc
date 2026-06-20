"use client";

import { useState } from "react";
import type { LandingBenefit } from "@/types/product";

export default function LandingBenefits({ benefits }: { benefits: LandingBenefit[] }) {
  return (
    <section className="bg-neutral-50 py-10 dark:bg-neutral-900/50 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-whatsapp">لماذا تختارنا</p>
          <h2 className="mt-2 text-2xl font-bold text-ink dark:text-white sm:text-3xl">
            شنو كتستافد ملي تطلب
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="text-2xl" aria-hidden>{b.icon}</span>
              <h3 className="mt-3 text-sm font-bold text-ink dark:text-white">{b.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
