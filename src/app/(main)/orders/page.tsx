"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { formatPrice, ORDER_STATUS_LABELS, buildWhatsAppContactUrl } from "@/lib/utils";
import type { Order } from "@/types/product";
import OrderTrackingTimeline from "@/components/OrderTrackingTimeline";

function OrdersContent() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [orders, setOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const num = searchParams.get("orderNumber");
    if (num) {
      setOrderNumber(num);
      fetch(`/api/orders/lookup?orderNumber=${num}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.orderNumber) setSingleOrder(data);
        });
    }
  }, [searchParams]);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSingleOrder(null);

    if (orderNumber.trim()) {
      const res = await fetch(`/api/orders/lookup?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
      const data = await res.json();
      if (res.ok) setSingleOrder(data);
      return;
    }

    if (phone.trim()) {
      const res = await fetch(`/api/orders/lookup?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (res.ok) setOrders(Array.isArray(data) ? data : []);
    }
  };

  const displayOrders = singleOrder ? [singleOrder] : orders;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink dark:text-white">تتبع الطلبات</h1>
      <p className="mt-1 text-sm text-ink-muted">تابع الطلبية ديالك برقم الطلب أو الهاتف</p>

      <form onSubmit={search} className="mt-8 space-y-4 rounded-2xl border border-neutral-100 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <input placeholder="رقم الطلب (مثال: SM202606-1234)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" dir="ltr" />
        <p className="text-center text-xs text-ink-muted">أو</p>
        <input placeholder="رقم الهاتف — سجل الطلبات ديالك" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" dir="ltr" />
        <button type="submit" className="w-full rounded-xl bg-ink py-3 text-sm font-bold text-white dark:bg-whatsapp">بحث</button>
      </form>

      <div className="mt-8 space-y-6">
        {displayOrders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-card dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold text-ink dark:text-white">#{order.orderNumber}</p>
                <p className="mt-1 text-sm text-ink-muted">{new Date(order.createdAt).toLocaleString("ar-MA")}</p>
              </div>
              <span className="rounded-full bg-whatsapp-light px-3 py-1 text-xs font-bold text-whatsapp-dark">
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="mt-6">
              <OrderTrackingTimeline status={order.status} />
            </div>

            <ul className="mt-6 space-y-1 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-ink-muted">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1 text-sm">
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-ink-muted"><span>التوصيل</span><span>{formatPrice(order.shippingCost)}</span></div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-whatsapp"><span>خصم {order.couponCode}</span><span>-{formatPrice(order.discount)}</span></div>
              )}
            </div>

            <p className="mt-4 text-lg font-bold text-ink dark:text-white">{formatPrice(order.total)}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/orders/invoice?orderNumber=${order.orderNumber}`}
                target="_blank"
                className="rounded-lg bg-neutral-100 px-4 py-2 text-xs font-medium dark:bg-neutral-800"
              >
                طباعة الفاتورة
              </Link>
              <a href={buildWhatsAppContactUrl(`السلام عليكم، بخصوص الطلب ${order.orderNumber}`)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-whatsapp">
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        ))}
        {searched && displayOrders.length === 0 && (
          <p className="text-center text-ink-muted">ما لقينا حتى طلب</p>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">كيتم التحميل...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
