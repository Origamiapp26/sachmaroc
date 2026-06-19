"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  items?: typeof products;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function ProductGrid({
  items = products,
  title,
  subtitle,
  showViewAll = false,
}: ProductGridProps) {
  const { addItem } = useCart();

  return (
    <section className="py-16 md:py-24">
      {(title || subtitle) && (
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            {subtitle && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                {title}
              </h2>
            )}
          </div>
          {showViewAll && (
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              Voir tout
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {items.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addItem}
            priority={index < 3}
          />
        ))}
      </div>
    </section>
  );
}
