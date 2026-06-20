"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";

export default function LandingHeroGallery({
  images,
  name,
  discount,
}: {
  images: string[];
  name: string;
  discount?: number | null;
}) {
  const [index, setIndex] = useState(0);
  const list = images.length > 0 ? images : [];

  const prev = () => setIndex((i) => (i === 0 ? list.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === list.length - 1 ? 0 : i + 1));

  if (list.length === 0) return null;

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-[4/3] max-h-[36vh] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800 sm:max-h-[42vh] lg:aspect-square lg:max-h-none lg:rounded-3xl">
        <ProductImage
          src={list[index]}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 90vw, 45vw"
        />
        {discount && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            -{discount}%
          </span>
        )}
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base shadow dark:bg-neutral-800"
              aria-label="السابق"
            >
              ›
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base shadow dark:bg-neutral-800"
              aria-label="التالي"
            >
              ‹
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`صورة ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
