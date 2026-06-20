"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () => setSelected((s) => (s === 0 ? images.length - 1 : s - 1));
  const next = () => setSelected((s) => (s === images.length - 1 ? 0 : s + 1));

  return (
    <div>
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-neutral-50 ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800"
        onClick={() => setZoomed(true)}
      >
        <ProductImage
          src={images[selected]}
          alt={name}
          fill
          priority={selected === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg shadow dark:bg-neutral-800"
            >
              ›
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg shadow dark:bg-neutral-800"
            >
              ‹
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
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
        >
          <button
            className="absolute left-4 top-4 text-2xl text-white"
            onClick={() => setZoomed(false)}
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
