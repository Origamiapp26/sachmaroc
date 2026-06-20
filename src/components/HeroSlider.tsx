"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";
import type { ResolvedHeroSlide } from "@/lib/hero-slides";
import { useSettings } from "@/context/SettingsContext";

const INTERVAL_MS = 5500;

export default function HeroSlider({ slides }: { slides: ResolvedHeroSlide[] }) {
  const { storeName } = useSettings();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length, paused, next]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-whatsapp/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="order-2 flex flex-col text-center lg:order-1 lg:text-right">
            <div className="mb-4 inline-flex items-center justify-center gap-2 self-center rounded-full border border-whatsapp/40 bg-whatsapp/10 px-4 py-1.5 lg:self-start">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-whatsapp" />
              <span className="text-xs font-semibold text-whatsapp">{storeName}</span>
            </div>

            <h1
              key={`title-${slide.productId}`}
              className="text-3xl font-bold leading-tight tracking-tight text-white animate-fade-in sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              {slide.title}
            </h1>

            <p
              key={`desc-${slide.productId}`}
              className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-neutral-300 animate-fade-in lg:mx-0 lg:text-lg"
            >
              {slide.shortDescription}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
              <span className="text-3xl font-bold text-white sm:text-4xl">
                {formatPrice(slide.price)}
              </span>
              {slide.oldPrice && (
                <span className="text-lg text-neutral-500 line-through">
                  {formatPrice(slide.oldPrice)}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href={`/products/${slide.productId}#product-order-form`}
                className="inline-flex items-center justify-center rounded-full bg-whatsapp px-8 py-4 text-sm font-bold text-white shadow-lg shadow-whatsapp/30 transition-transform hover:scale-[1.02] hover:bg-whatsapp-dark"
              >
                {slide.ctaOrder}
              </Link>
              <Link
                href={`/products/${slide.productId}`}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {slide.ctaDetails}
              </Link>
            </div>

            {/* Dots */}
            {slides.length > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2 lg:justify-start">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`شريحة ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-8 bg-whatsapp" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-lg">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-whatsapp/30 to-amber-500/20 blur-sm" />
              <div
                key={`img-${slide.productId}`}
                className="relative overflow-hidden rounded-3xl bg-neutral-800 shadow-2xl animate-fade-in"
              >
                <ProductImage
                  src={slide.image}
                  alt={slide.title}
                  width={800}
                  height={900}
                  priority={index === 0}
                  className="aspect-[4/5] w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-md dark:bg-neutral-900/95">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-whatsapp">
                    منتج مميز
                  </p>
                  <p className="mt-0.5 truncate text-sm font-bold text-ink dark:text-white">
                    {slide.title}
                  </p>
                  <p className="text-lg font-bold text-ink dark:text-white">
                    {formatPrice(slide.price)}
                  </p>
                </div>
              </div>

              {slides.length > 1 && (
                <>
                  <button
                    onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                    className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-lg shadow-lg dark:bg-neutral-800 dark:text-white"
                    aria-label="السابق"
                  >
                    ›
                  </button>
                  <button
                    onClick={next}
                    className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full bg-white text-lg shadow-lg dark:bg-neutral-800 dark:text-white"
                    aria-label="التالي"
                  >
                    ‹
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
