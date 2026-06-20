"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";
import type { Order } from "@/types/product";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const { storeName, contact } = useSettings();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/lookup?orderNumber=${encodeURIComponent(orderNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.orderNumber) setOrder(data);
      });
  }, [orderNumber]);

  useEffect(() => {
    if (order) {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [order]);

  if (!order) {
    return <div className="p-8 text-center">كيتحمّل...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-8 print:p-4">
      <style jsx global>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{storeName}</h1>
        <p className="text-sm text-neutral-500">{contact.address}</p>
        <p className="text-sm text-neutral-500" dir="ltr">{contact.phone}</p>
      </div>

      <div className="mb-6 flex justify-between border-b pb-4">
        <div>
          <p className="font-bold">فاتورة #{order.orderNumber}</p>
          <p className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleString("ar-MA")}</p>
        </div>
        <p className="text-sm">{ORDER_STATUS_LABELS[order.status]}</p>
      </div>

      <div className="mb-6 text-sm">
        <p><strong>الزبون:</strong> {order.customerName}</p>
        <p><strong>الهاتف:</strong> {order.customerPhone}</p>
        <p><strong>المدينة:</strong> {order.customerCity}</p>
        <p><strong>العنوان:</strong> {order.customerAddress}</p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-right">المنتج</th>
            <th className="py-2 text-center">الكمية</th>
            <th className="py-2 text-left">الثمن</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-neutral-100">
              <td className="py-2">{item.productName}</td>
              <td className="py-2 text-center">{item.quantity}</td>
              <td className="py-2 text-left">{formatPrice(item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 space-y-1 text-sm">
        <div className="flex justify-between"><span>المجموع الفرعي</span><span>{formatPrice(order.subtotal)}</span></div>
        {order.shippingCost > 0 && <div className="flex justify-between"><span>التوصيل</span><span>{formatPrice(order.shippingCost)}</span></div>}
        {order.discount > 0 && <div className="flex justify-between"><span>خصم</span><span>-{formatPrice(order.discount)}</span></div>}
        <div className="flex justify-between text-lg font-bold"><span>المجموع</span><span>{formatPrice(order.total)}</span></div>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-400">الدفع عند الاستلام — شكراً لثقتكم</p>

      <button onClick={() => window.print()} className="no-print mt-6 w-full rounded-xl bg-ink py-3 text-sm font-bold text-white">
        طباعة
      </button>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="p-8">كيتحمّل...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
