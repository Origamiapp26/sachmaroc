"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatPrice, buildWhatsAppOrderUrl } from "@/lib/utils";
import CashOnDeliveryBadge from "@/components/CashOnDeliveryBadge";

export default function CheckoutPage() {
  const router = useRouter();
  const { cities } = useSettings();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerCity: cities[0]?.name || "",
    customerAddress: "",
    notes: "",
  });

  const shippingCost = useMemo(() => {
    const city = cities.find((c) => c.name === form.customerCity);
    return city?.shippingCost ?? 35;
  }, [cities, form.customerCity]);

  const subtotal = totalPrice;
  const grandTotal = Math.max(0, subtotal + shippingCost - discount);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink dark:text-white">السلة خاوية</h1>
        <Link href="/products" className="mt-6 rounded-full bg-ink px-8 py-3 text-sm font-bold text-white dark:bg-whatsapp">
          شوف المنتجات
        </Link>
      </div>
    );
  }

  const applyCoupon = async () => {
    setCouponError("");
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const data = await res.json();
    if (res.ok) {
      setDiscount(data.discount);
    } else {
      setDiscount(0);
      setCouponError(data.error);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = items.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      quantity: i.quantity,
      unitPrice: i.product.price,
    }));

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: orderItems,
        shippingCost,
        discount,
        couponCode: discount > 0 ? couponCode : undefined,
      }),
    });

    if (res.ok) {
      const order = await res.json();
      clearCart();
      const waUrl = buildWhatsAppOrderUrl(
        orderItems.map((i) => ({ name: i.productName, quantity: i.quantity, price: i.unitPrice })),
        order.total,
        order.orderNumber
      );
      window.open(waUrl, "_blank");
      router.push(`/orders?orderNumber=${order.orderNumber}`);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink dark:text-white">إتمام الطلب</h1>
      <p className="mt-1 text-sm text-ink-muted">الدفع عند الاستلام — عمر المعلومات ديالك</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <input placeholder="الاسم الكامل *" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" required />
        <input placeholder="رقم الهاتف *" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" required dir="ltr" />

        <select
          value={form.customerCity}
          onChange={(e) => setForm({ ...form, customerCity: e.target.value })}
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          required
        >
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} — توصيل {formatPrice(c.shippingCost)}
            </option>
          ))}
        </select>

        <textarea placeholder="العنوان الكامل *" value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} rows={2} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" required />
        <textarea placeholder="ملاحظات (اختياري)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />

        <div className="flex gap-2">
          <input
            placeholder="كود الخصم"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            dir="ltr"
          />
          <button type="button" onClick={applyCoupon} className="rounded-xl bg-neutral-100 px-4 py-3 text-sm font-medium dark:bg-neutral-800">
            تطبيق
          </button>
        </div>
        {couponError && <p className="text-sm text-red-500">{couponError}</p>}
        {discount > 0 && <p className="text-sm text-whatsapp">خصم: {formatPrice(discount)}</p>}

        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-bold text-ink dark:text-white">ملخص الطلب</h2>
          <ul className="mt-3 space-y-2">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between text-sm text-ink-muted">
                <span>{product.name} × {quantity}</span>
                <span>{formatPrice(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-700">
            <div className="flex justify-between text-ink-muted"><span>المجموع الفرعي</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-ink-muted"><span>التوصيل</span><span>{formatPrice(shippingCost)}</span></div>
            {discount > 0 && <div className="flex justify-between text-whatsapp"><span>الخصم</span><span>-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between text-lg font-bold text-ink dark:text-white"><span>المجموع</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
        </div>

        <CashOnDeliveryBadge />

        <button type="submit" disabled={loading} className="w-full rounded-full bg-whatsapp py-4 text-sm font-bold text-white hover:bg-whatsapp-dark disabled:opacity-50">
          {loading ? "كيتسجل الطلب..." : "أكد الطلب (الدفع عند الاستلام)"}
        </button>
      </form>
    </div>
  );
}
