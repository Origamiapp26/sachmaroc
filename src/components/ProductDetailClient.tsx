"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { trackViewContent } from "@/lib/tracking";
import CashOnDeliveryBadge from "@/components/CashOnDeliveryBadge";
import DeliveryBadge from "@/components/DeliveryBadge";
import ProductBenefits from "@/components/ProductBenefits";
import ProductGallery from "@/components/ProductGallery";
import ProductOrderForm from "@/components/ProductOrderForm";
import ShareButtons from "@/components/ShareButtons";
import DeliveryInfo from "@/components/DeliveryInfo";
import { useSettings } from "@/context/SettingsContext";

export default function ProductDetailClient({
  product,
  productUrl,
}: {
  product: Product;
  productUrl: string;
}) {
  const { trustBar } = useSettings();
  const allImages = [product.image, ...product.gallery.filter((g) => g !== product.image)];

  const benefits = useMemo(
    () =>
      trustBar.length > 0
        ? trustBar.slice(0, 3).map((t) => `${t.icon} ${t.text}`)
        : undefined,
    [trustBar]
  );

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }, [product.id, product.name, product.price, product.category]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <nav className="mb-3 hidden items-center gap-2 text-xs text-ink-faint sm:mb-4 sm:flex sm:text-sm">
        <Link href="/" className="hover:text-ink dark:hover:text-white">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink dark:hover:text-white">المنتجات</Link>
        <span>/</span>
        <span className="truncate text-ink-muted">{product.name}</span>
      </nav>

      {/* Above-the-fold conversion layout */}
      <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-10">
        {/* Left — Gallery */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProductGallery images={allImages} name={product.name} compact />
        </div>

        {/* Right — Order column */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {product.featured && (
              <span className="rounded-full bg-whatsapp-light px-2.5 py-0.5 text-[10px] font-bold text-whatsapp-dark">
                مميز
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold text-white">
                -{discount}%
              </span>
            )}
            <span className="text-[11px] font-medium text-ink-faint">{product.category}</span>
          </div>

          <h1 className="mt-1.5 text-xl font-bold leading-snug tracking-tight text-ink dark:text-white sm:text-2xl lg:text-3xl">
            {product.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold text-whatsapp sm:text-3xl">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-base text-ink-faint line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <CashOnDeliveryBadge compact />
            <DeliveryBadge />
          </div>

          <div className="mt-3 rounded-xl border border-whatsapp/15 bg-whatsapp-light/20 px-3 py-2.5 dark:border-whatsapp/20 dark:bg-whatsapp/5">
            <ProductBenefits items={benefits} compact />
          </div>

          <div className="mt-3">
            <ProductOrderForm product={product} productUrl={productUrl} compact />
          </div>
        </div>
      </div>

      {/* Below the fold */}
      <div className="mt-10 border-t border-neutral-100 pt-8 dark:border-neutral-800 lg:mt-12">
        <h2 className="mb-3 text-sm font-bold text-ink dark:text-white">وصف المنتج</h2>
        <p className="text-sm leading-relaxed text-ink-muted">{product.description}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DeliveryInfo />
          <div>
            <p className="mb-3 text-sm font-bold text-ink dark:text-white">شارك المنتج</p>
            <ShareButtons url={productUrl} title={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
