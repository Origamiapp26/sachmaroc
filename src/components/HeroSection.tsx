"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { useSettings } from "@/context/SettingsContext";

export default function HeroSection() {
  const { hero, storeName } = useSettings();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-whatsapp-light/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[85vh] flex-col items-center justify-center py-16 lg:flex-row lg:gap-16 lg:py-0">
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-right">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp-light/60 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
              <span className="text-xs font-medium text-ink dark:text-white">{hero.badge}</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-ink dark:text-white sm:text-5xl md:text-6xl">
              {hero.title}{" "}
              <span className="text-whatsapp">{hero.titleHighlight || storeName}</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-ink"
              >
                {hero.ctaPrimary}
              </Link>
              <Link
                href="/products?sort=best"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-8 py-3.5 text-sm font-semibold text-ink hover:border-whatsapp dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>

          {hero.image && (
            <div className="relative mt-12 flex flex-1 items-center justify-center lg:mt-0">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="relative overflow-hidden rounded-3xl bg-neutral-50 shadow-luxury dark:bg-neutral-900">
                  <ProductImage
                    src={hero.image}
                    alt={storeName}
                    width={800}
                    height={1000}
                    className="aspect-[4/5] w-full object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
