"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import CashOnDeliveryBadge from "@/components/CashOnDeliveryBadge";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
          <svg
            className="h-10 w-10 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-ink">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Découvrez notre collection premium
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Explorer le catalogue
        </Link>
      </div>
    );
  }

  const whatsappItems = items.map((i) => ({
    name: i.product.name,
    quantity: i.quantity,
    price: i.product.price,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Panier
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        {items.length} article{items.length > 1 ? "s" : ""}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Cart items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:gap-6 sm:p-6"
            >
              <Link
                href={`/products/${product.slug}`}
                className="shrink-0 overflow-hidden rounded-xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm font-semibold text-ink hover:text-brand-600"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-slate-200">
                    <button
                      onClick={() =>
                        quantity > 1
                          ? updateQuantity(product.id, quantity - 1)
                          : removeItem(product.id)
                      }
                      className="flex h-8 w-8 items-center justify-center text-sm text-ink-muted"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-sm text-ink-muted"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-ink">
                      {formatPrice(product.price * quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-xs text-ink-faint transition-colors hover:text-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-ink">Récapitulatif</h2>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Sous-total</span>
              <span className="font-medium text-ink">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Livraison</span>
              <span className="font-medium text-green-600">Gratuite</span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-ink">Total</span>
                <span className="text-xl font-semibold text-ink">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CashOnDeliveryBadge />
          </div>

          <div className="mt-6 space-y-3">
            <WhatsAppButton
              items={whatsappItems}
              total={totalPrice}
              className="w-full"
            />
            <button
              onClick={clearCart}
              className="w-full rounded-full border border-slate-200 py-3 text-sm font-medium text-ink-muted transition-colors hover:border-red-200 hover:text-red-500"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
