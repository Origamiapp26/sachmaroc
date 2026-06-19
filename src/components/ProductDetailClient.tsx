"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice, buildWhatsAppProductUrl } from "@/lib/utils";
import CashOnDeliveryBadge from "@/components/CashOnDeliveryBadge";
import DeliveryInfo from "@/components/DeliveryInfo";
import ProductGallery from "@/components/ProductGallery";
import ShareButtons from "@/components/ShareButtons";

export default function ProductDetailClient({
  product,
  productUrl,
}: {
  product: Product;
  productUrl: string;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const allImages = [product.image, ...product.gallery.filter((g) => g !== product.image)];
  const whatsappUrl = buildWhatsAppProductUrl(product, productUrl);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-ink-faint">
        <Link href="/" className="hover:text-ink dark:hover:text-white">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink dark:hover:text-white">المنتجات</Link>
        <span>/</span>
        <span className="text-ink-muted">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={allImages} name={product.name} />

        <div className="flex flex-col">
          {product.featured && (
            <span className="mb-3 inline-flex w-fit rounded-full bg-whatsapp-light px-3 py-1 text-[11px] font-bold text-whatsapp-dark">
              منتج مميز
            </span>
          )}

          <p className="text-xs font-medium text-ink-faint">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink dark:text-white md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-ink-faint line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-muted">{product.description}</p>

          <div className="mt-6">
            <ShareButtons url={productUrl} title={product.name} />
          </div>

          <div className="mt-8">
            <CashOnDeliveryBadge />
          </div>
          <div className="mt-6">
            <DeliveryInfo />
          </div>

          {product.inStock ? (
            <>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-11 w-11 items-center justify-center text-ink-muted">−</button>
                  <span className="w-10 text-center text-sm font-bold dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex h-11 w-11 items-center justify-center text-ink-muted">+</button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 rounded-full bg-ink px-8 py-3.5 text-sm font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-ink">
                  {added ? "تزاد للسلة ✓" : "زيد للسلة"}
                </button>
              </div>
              <div className="mt-4">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-whatsapp-dark">
                  اطلب هاد المنتج عبر واتساب
                </a>
              </div>
            </>
          ) : (
            <p className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-600 dark:bg-red-950">
              نفد المخزون حالياً
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
