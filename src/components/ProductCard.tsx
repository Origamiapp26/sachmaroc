"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn(
            starSize,
            i < Math.floor(rating)
              ? "text-amber-400"
              : i < rating
                ? "text-amber-300"
                : "text-slate-200"
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  priority?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  priority = false,
}: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  return (
    <article className="group relative flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100/80 transition-all duration-500 group-hover:shadow-card-hover group-hover:ring-brand-200/60">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.badge && (
                <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-600 shadow-sm backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Quick add button */}
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-luxury transition-all duration-300 hover:bg-brand-600 hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
                aria-label={`Ajouter ${product.name} au panier`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="mt-4 space-y-2 px-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-faint">
            {product.category}
          </p>
          <h3 className="text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
            {product.name}
          </h3>
          <p className="line-clamp-1 text-sm text-ink-muted">{product.tagline}</p>

          <div className="flex items-center gap-2 pt-0.5">
            <StarRating rating={product.rating} />
            <span className="text-xs text-ink-faint">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-semibold tracking-tight text-ink">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-ink-faint line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
