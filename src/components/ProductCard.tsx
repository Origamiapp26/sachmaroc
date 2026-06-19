"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";

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
                : "text-neutral-200"
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
        <div className="relative overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 transition-all duration-500 group-hover:shadow-card-hover group-hover:ring-whatsapp/30">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute right-3 top-3 flex flex-col gap-2">
              {product.badge && (
                <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-ink shadow-sm backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="absolute bottom-3 left-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-luxury transition-all duration-300 hover:bg-ink hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
                aria-label={`زيد ${product.name} للسلة`}
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

        <div className="mt-4 space-y-2 px-1">
          <p className="text-[11px] font-medium text-ink-faint">
            {product.category}
          </p>
          <h3 className="text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-whatsapp-dark">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-ink-faint">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-ink dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-ink-faint line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <p className="text-xs text-amber-600">باقي {product.stockQuantity} فقط</p>
          )}
          {!product.inStock && (
            <p className="text-xs text-red-500">نفد المخزون</p>
          )}
        </div>
      </Link>

      <div className="mt-3 px-1">
        <WhatsAppButton
          items={[{ name: product.name, quantity: 1, price: product.price }]}
          total={product.price}
          label="اطلب دابا"
          className="w-full py-2.5 text-xs"
        />
      </div>
    </article>
  );
}
