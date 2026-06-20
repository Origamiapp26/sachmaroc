"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types/product";

function ProductsContent({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "الكل"
  );
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "الكل") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, query, sort, inStockOnly]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">المتجر</p>
        <h1 className="text-4xl font-bold tracking-tight text-ink dark:text-white">المنتجات</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
          تصفح مجموعتنا — البيانات كتجي من <code className="text-xs">data/products.json</code>
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <input
          type="search"
          placeholder="قلب على منتج..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-whatsapp dark:border-neutral-700 dark:bg-neutral-900 dark:text-white md:col-span-2"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        >
          <option value="newest">الأحدث</option>
          <option value="price_asc">السعر: من الأقل</option>
          <option value="price_desc">السعر: من الأعلى</option>
          <option value="name">الاسم</option>
        </select>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-ink text-white dark:bg-whatsapp"
                : "border border-neutral-200 bg-white text-ink-muted hover:border-whatsapp dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
            }`}
          >
            {cat}
          </button>
        ))}
        <label className="mr-auto flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded" />
          متوفر فقط
        </label>
      </div>

      <p className="mb-6 text-sm text-ink-muted">{filtered.length} منتج</p>
      <ProductGrid items={filtered} />
    </div>
  );
}

export default function ProductsPageClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink-muted">كيتم التحميل...</div>}>
      <ProductsContent products={products} categories={categories} />
    </Suspense>
  );
}
