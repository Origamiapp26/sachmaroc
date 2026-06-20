"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice, buildWhatsAppDirectOrderUrl } from "@/lib/utils";
import { trackPurchase } from "@/lib/tracking";
import { useSettings } from "@/context/SettingsContext";

interface ProductOrderFormProps {
  product: Product;
  productUrl: string;
  compact?: boolean;
  formId?: string;
  showSticky?: boolean;
}

export default function ProductOrderForm({
  product,
  productUrl,
  compact = false,
  formId = "product-order-form",
  showSticky = true,
}: ProductOrderFormProps) {
  const { whatsappNumber, cities } = useSettings();
  const cityList = useMemo(
    () => (cities.length > 0 ? cities : [{ name: "الدار البيضاء", shippingCost: 35 }]),
    [cities]
  );

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerCity: cityList[0].name,
    customerAddress: "",
    notes: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [placedOrder, setPlacedOrder] = useState<{
    orderNumber: string;
    total: number;
    shippingCost: number;
  } | null>(null);

  const shippingCost = useMemo(() => {
    const city = cityList.find((c) => c.name === form.customerCity);
    return city?.shippingCost ?? 35;
  }, [cityList, form.customerCity]);

  const subtotal = product.price * quantity;
  const total = subtotal + shippingCost;

  const inputClass = compact
    ? "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-whatsapp dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
    : "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-whatsapp dark:border-neutral-700 dark:bg-neutral-900 dark:text-white";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setPlacedOrder(null);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerCity: form.customerCity,
        customerAddress: form.customerAddress,
        notes: form.notes || undefined,
        shippingCost,
        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice: product.price,
          },
        ],
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "وقع خطأ فالطلب");
      return;
    }

    trackPurchase({
      orderNumber: data.orderNumber,
      total: data.total,
      shippingCost: data.shippingCost ?? shippingCost,
      items: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          quantity,
        },
      ],
    });

    setPlacedOrder({
      orderNumber: data.orderNumber,
      total: data.total,
      shippingCost: data.shippingCost ?? shippingCost,
    });
    setSuccess(`تم تسجيل الطلب #${data.orderNumber} ✓`);
  };

  const whatsappUrl =
    placedOrder &&
    buildWhatsAppDirectOrderUrl(
      {
        orderNumber: placedOrder.orderNumber,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerCity: form.customerCity,
        customerAddress: form.customerAddress,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        shippingCost: placedOrder.shippingCost,
        total: placedOrder.total,
        productUrl,
      },
      whatsappNumber || product.whatsappNumber
    );

  if (!product.inStock) {
    return (
      <p className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-600 dark:bg-red-950">
        نفد المخزون حالياً
      </p>
    );
  }

  return (
    <>
      <form
        id={formId}
        onSubmit={submit}
        className={
          compact
            ? "rounded-xl border-2 border-whatsapp/25 bg-white p-3 shadow-sm dark:border-whatsapp/30 dark:bg-neutral-900 sm:p-4"
            : "rounded-2xl border-2 border-whatsapp/20 bg-whatsapp-light/30 p-5 dark:border-whatsapp/30 dark:bg-whatsapp/5 sm:p-6"
        }
      >
        {!compact && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-ink dark:text-white">اطلب دابا</h2>
          </div>
        )}

        {compact && (
          <p className="mb-3 text-sm font-bold text-ink dark:text-white">اطلب دابا — الدفع عند الاستلام</p>
        )}

        <div className={`space-y-2.5 ${compact ? "sm:grid sm:grid-cols-2 sm:gap-2.5 sm:space-y-0" : "space-y-3"}`}>
          <input
            placeholder="الاسم الكامل *"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            required
            className={inputClass}
          />
          <input
            placeholder="رقم الهاتف *"
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            required
            dir="ltr"
            type="tel"
            className={inputClass}
          />
          <select
            value={form.customerCity}
            onChange={(e) => setForm({ ...form, customerCity: e.target.value })}
            required
            className={`${inputClass} sm:col-span-2`}
          >
            {cityList.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} — توصيل {formatPrice(c.shippingCost)}
              </option>
            ))}
          </select>
          <textarea
            placeholder="العنوان الكامل *"
            value={form.customerAddress}
            onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
            required
            rows={compact ? 1 : 2}
            className={`${inputClass} sm:col-span-2`}
          />
          {!compact && (
            <textarea
              placeholder="ملاحظات (اختياري)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className={`${inputClass} sm:col-span-2`}
            />
          )}
          {compact && (
            <input
              placeholder="ملاحظات (اختياري)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`${inputClass} sm:col-span-2`}
            />
          )}

          <div
            className={`flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 sm:col-span-2 ${
              compact ? "" : "rounded-xl px-4 py-3"
            }`}
          >
            <span className="text-xs font-medium text-ink-muted sm:text-sm">الكمية</span>
            <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-600">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center text-ink-muted"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-bold dark:text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-ink-muted"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div
          className={`mt-3 space-y-1 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50 ${
            compact ? "" : "mt-5 space-y-2 rounded-xl bg-white p-4 dark:bg-neutral-900"
          }`}
        >
          <div className="flex justify-between text-xs text-ink-muted sm:text-sm">
            <span className="truncate pe-2">{product.name} × {quantity}</span>
            <span className="shrink-0">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-ink-muted sm:text-sm">
            <span>التوصيل</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-1.5 text-base font-bold text-ink dark:border-neutral-700 dark:text-white">
            <span>المجموع</span>
            <span className="text-whatsapp">{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="mt-2 text-xs text-red-500 sm:text-sm">{error}</p>}
        {success && <p className="mt-2 text-xs font-medium text-whatsapp sm:text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`mt-3 w-full rounded-full bg-whatsapp font-bold text-white shadow-lg hover:bg-whatsapp-dark disabled:opacity-50 ${
            compact ? "py-3.5 text-sm lg:py-4 lg:text-base" : "hidden py-4 text-base lg:block"
          }`}
        >
          {loading ? "كيتسجل الطلب..." : "اطلب الآن"}
        </button>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-whatsapp/40 py-2.5 text-xs font-bold text-whatsapp hover:bg-whatsapp-light sm:text-sm ${
              compact ? "" : "hidden lg:inline-flex"
            }`}
          >
            تواصل عبر واتساب
          </a>
        )}
      </form>

      {/* Sticky mobile CTA — only when compact (product page) */}
      {compact && showSticky && (
        <>
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 p-2.5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden">
            <div className="mb-1.5 flex items-center justify-between px-1 text-xs">
              <span className="text-ink-muted">المجموع</span>
              <span className="font-bold text-whatsapp">{formatPrice(total)}</span>
            </div>
            <button
              type="submit"
              form={formId}
              disabled={loading}
              className="w-full rounded-full bg-whatsapp py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-50"
            >
              {loading ? "كيتسجل..." : "اطلب الآن"}
            </button>
          </div>
          <div className="h-24 lg:hidden" aria-hidden />
        </>
      )}
    </>
  );
}
