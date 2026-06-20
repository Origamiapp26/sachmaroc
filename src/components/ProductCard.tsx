"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice, buildWhatsAppProductUrl } from "@/lib/utils";
import ProductImage from "./ProductImage";

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
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.id}`
      : `https://sachmaroc.ma/products/${product.id}`;

  const whatsappUrl = buildWhatsAppProductUrl(product, productUrl);

  return (
    <article className="group relative flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-neutral-100 transition-all duration-500 group-hover:shadow-card-hover group-hover:ring-whatsapp/30 dark:bg-neutral-900 dark:ring-neutral-800">
          <div className="relative aspect-[4/5] overflow-hidden">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute right-3 top-3 flex flex-col gap-2">
              {product.featured && (
                <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-ink shadow-sm backdrop-blur-sm dark:bg-neutral-900/95 dark:text-white">
                  مميز
                </span>
              )}
              {discount && (
                <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {onAddToCart && product.inStock && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="absolute bottom-3 left-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-luxury transition-all duration-300 hover:bg-ink hover:text-white group-hover:translate-y-0 group-hover:opacity-100 dark:bg-neutral-800 dark:text-white"
                aria-label={`زيد ${product.name} للسلة`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 px-1">
          <p className="text-[11px] font-medium text-ink-faint">{product.category}</p>
          <h3 className="text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-whatsapp-dark dark:text-white">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-ink dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-ink-faint line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          {!product.inStock && (
            <p className="text-xs text-red-500">نفد المخزون</p>
          )}
        </div>
      </Link>

      {product.inStock && (
        <div className="mt-3 flex flex-col gap-2 px-1">
          <Link
            href={`/products/${product.id}#product-order-form`}
            className="inline-flex w-full items-center justify-center rounded-full bg-whatsapp py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-whatsapp-dark"
          >
            اطلب الآن
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-whatsapp/30 py-2 text-xs font-medium text-whatsapp hover:bg-whatsapp-light"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            واتساب
          </a>
        </div>
      )}
    </article>
  );
}
