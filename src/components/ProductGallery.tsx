"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";

interface ProductGalleryProps {
  images: string[];
  name: string;
  compact?: boolean;
}

export default function ProductGallery({ images, name, compact = false }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setSelected((s) => (s === 0 ? images.length - 1 : s - 1));
  const next = () => setSelected((s) => (s === images.length - 1 ? 0 : s + 1));

  return (
    <div>
      <div
        className={`relative cursor-zoom-in overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800 lg:rounded-3xl ${
          compact
            ? "aspect-[4/3] max-h-[38vh] lg:aspect-square lg:max-h-none"
            : "aspect-square"
        }`}
        onClick={() => setZoomed(true)}
      >
        <ProductImage
          src={images[selected]}
          alt={name}
          fill
          priority={selected === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base shadow dark:bg-neutral-800 lg:right-3 lg:h-10 lg:w-10"
              aria-label="الصورة السابقة"
            >
              ›
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base shadow dark:bg-neutral-800 lg:left-3 lg:h-10 lg:w-10"
              aria-label="الصورة التالية"
            >
              ‹
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 lg:hidden">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selected ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className={`mt-2 flex gap-2 overflow-x-auto lg:mt-4 lg:gap-3 ${compact ? "hidden lg:flex" : ""}`}>
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 transition-all lg:h-20 lg:w-20 lg:rounded-xl ${
                selected === i ? "ring-ink dark:ring-whatsapp" : "ring-transparent"
              }`}
            >
              <ProductImage src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute left-4 top-4 text-2xl text-white"
            onClick={() => setZoomed(false)}
            aria-label="إغلاق"
          >
            ×
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <ProductImage
              src={images[selected]}
              alt={name}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
