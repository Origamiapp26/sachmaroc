"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/product";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const ready = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "">("");

  const load = useCallback(async () => {
    const url = filter ? `/api/orders?status=${filter}` : "/api/orders";
    const res = await fetch(url);
    setOrders(await res.json());
  }, [filter]);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <AdminShell>
      {!ready ? (
        <p className="text-ink-muted">كيتحمّل...</p>
      ) : (
        <>
      <h1 className="text-2xl font-bold text-ink dark:text-white">الطلبات</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-4 py-1.5 text-xs font-medium ${!filter ? "bg-ink text-white" : "border dark:border-neutral-700 dark:text-white"}`}>الكل</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-xs font-medium ${filter === s ? "bg-ink text-white dark:bg-whatsapp" : "border dark:border-neutral-700 dark:text-white"}`}>
            {ORDER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold text-ink dark:text-white">#{order.orderNumber}</p>
                <p className="mt-1 text-sm text-ink-muted">{order.customerName} — {order.customerPhone}</p>
                <p className="text-sm text-ink-muted">{order.customerCity} — {order.customerAddress}</p>
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-ink dark:text-white">{formatPrice(order.total)}</p>
                <p className="text-xs text-ink-muted">{new Date(order.createdAt).toLocaleString("ar-MA")}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-3 dark:border-neutral-800">
              {order.items.map((item) => (
                <li key={item.id} className="text-sm text-ink-muted">
                  {item.productName} × {item.quantity} — {formatPrice(item.unitPrice * item.quantity)}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium ${order.status === s ? "bg-whatsapp text-white" : "bg-neutral-100 dark:bg-neutral-800 dark:text-white"}`}
                >
                  {ORDER_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-ink-muted">ما كاين حتى طلب</p>}
      </div>
        </>
      )}
    </AdminShell>
  );
}
