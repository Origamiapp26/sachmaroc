"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/ProductCard";
import ReviewsSection from "@/components/ReviewsSection";
import CashOnDeliveryBadge from "@/components/CashOnDeliveryBadge";
import DeliveryInfo from "@/components/DeliveryInfo";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-ink-faint">
        <Link href="/" className="hover:text-ink">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink">
          المنتجات
        </Link>
        <span>/</span>
        <span className="text-ink-muted">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="overflow-hidden rounded-3xl bg-neutral-50 ring-1 ring-neutral-100">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`overflow-hidden rounded-xl ring-2 transition-all ${
                    selectedImage === i
                      ? "ring-ink"
                      : "ring-transparent hover:ring-neutral-200"
                  }`}
                >
                  <img src={img} alt="" className="h-20 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.badge && (
            <span className="mb-3 inline-flex w-fit rounded-full bg-whatsapp-light px-3 py-1 text-[11px] font-bold text-whatsapp-dark">
              {product.badge}
            </span>
          )}

          <p className="text-xs font-medium text-ink-faint">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-base text-ink-muted">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-3">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm text-ink-muted">
              {product.rating} ({product.reviewCount} تقييم)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-ink-faint line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <ul className="mt-6 space-y-2">
            {product.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-ink-muted"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-whatsapp"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <CashOnDeliveryBadge />
          </div>

          <div className="mt-6">
            <DeliveryInfo />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-full border border-neutral-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-ink"
                aria-label="نقص الكمية"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-bold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-11 w-11 items-center justify-center text-ink-muted transition-colors hover:text-ink"
                aria-label="زيد الكمية"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-ink px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-neutral-800"
            >
              {added ? "تزاد للسلة ✓" : "زيد للسلة"}
            </button>
          </div>

          <div className="mt-4">
            <WhatsAppButton
              items={[
                { name: product.name, quantity, price: product.price },
              ]}
              total={product.price * quantity}
              label="اطلب هاد المنتج عبر واتساب"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-20">
          <ReviewsSection
            reviews={product.reviews}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>
      )}
    </div>
  );
}
