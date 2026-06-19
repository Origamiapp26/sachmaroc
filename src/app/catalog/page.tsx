"use client";

import { useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import { categories, getProductsByCategory } from "@/data/products";

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const filtered = getProductsByCategory(activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          Boutique
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">
          Catalogue
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
          Explorez notre collection premium de produits d&apos;exception
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                : "border border-slate-200 bg-white text-ink-muted hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <ProductGrid items={filtered} />
    </div>
  );
}
