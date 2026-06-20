"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/product";

const STATUSES: OrderStatus[] = ["new", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const ready = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const cities = useMemo(() => {
    const set = new Set(orders.map((o) => o.customerCity));
    return [...set].sort();
  }, [orders]);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    if (cityFilter) params.set("city", cityFilter);
    if (search) params.set("search", search);
    const qs = params.toString();
    const res = await fetch(`/api/orders${qs ? `?${qs}` : ""}`);
    setOrders(await res.json());
  }, [filter, cityFilter, search]);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  const updateStatus = async (order: Order, status: OrderStatus) => {
    const id = order.orderNumber || order.id;
    await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const exportCsv = () => {
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    if (cityFilter) params.set("city", cityFilter);
    if (search) params.set("search", search);
    const qs = params.toString();
    window.location.href = `/api/admin/orders/export${qs ? `?${qs}` : ""}`;
  };

  const displayStatus = (status: OrderStatus) =>
    ORDER_STATUS_LABELS[status] || ORDER_STATUS_LABELS.new;

  return (
    <AdminShell>
      {!ready ? (
        <p className="text-ink-muted">كيتحمّل...</p>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink dark:text-white">الطلبات</h1>
              <p className="mt-1 text-sm text-ink-muted">
                طلبات COD — كتتحفظ فقاعدة البيانات
              </p>
            </div>
            <button
              onClick={exportCsv}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-bold dark:border-neutral-700 dark:text-white"
            >
              تصدير CSV
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder="بحث بالاسم أو الهاتف..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
            <button
              onClick={() => setSearch(searchInput)}
              className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white dark:bg-whatsapp"
            >
              بحث
            </button>
            {(search || cityFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setCityFilter("");
                }}
                className="rounded-xl border px-4 py-2.5 text-sm dark:border-neutral-700"
              >
                مسح الفلاتر
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-full border px-4 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              <option value="">كل المدن</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ${!filter ? "bg-ink text-white" : "border dark:border-neutral-700 dark:text-white"}`}
            >
              الكل
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium ${filter === s ? "bg-ink text-white dark:bg-whatsapp" : "border dark:border-neutral-700 dark:text-white"}`}
              >
                {displayStatus(s)}
              </button>
            ))}
          </div>

          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 md:block">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-ink-muted dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">رقم الطلب</th>
                  <th className="px-4 py-3 text-right font-medium">الزبون</th>
                  <th className="px-4 py-3 text-right font-medium">الهاتف</th>
                  <th className="px-4 py-3 text-right font-medium">المدينة</th>
                  <th className="px-4 py-3 text-right font-medium">المنتج</th>
                  <th className="px-4 py-3 text-right font-medium">المجموع</th>
                  <th className="px-4 py-3 text-right font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {orders.map((order) => (
                  <tr key={order.id} className="bg-white dark:bg-neutral-900">
                    <td className="px-4 py-3 font-medium" dir="ltr">#{order.orderNumber}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3" dir="ltr">{order.customerPhone}</td>
                    <td className="px-4 py-3">{order.customerCity}</td>
                    <td className="px-4 py-3 text-ink-muted">{order.items[0]?.productName}</td>
                    <td className="px-4 py-3 font-bold">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={(order.status as string) === "pending" ? "new" : order.status}
                        onChange={(e) => updateStatus(order, e.target.value as OrderStatus)}
                        className="rounded-lg border px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{displayStatus(s)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4 md:hidden">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-ink dark:text-white" dir="ltr">#{order.orderNumber}</p>
                    <p className="mt-1 text-sm">{order.customerName}</p>
                    <p className="text-sm text-ink-muted" dir="ltr">{order.customerPhone}</p>
                    <p className="text-sm text-ink-muted">{order.customerCity}</p>
                    <p className="mt-2 text-sm font-medium">{order.items[0]?.productName}</p>
                  </div>
                  <p className="font-bold text-whatsapp">{formatPrice(order.total)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(order, s)}
                      className={`rounded-lg px-3 py-1 text-xs font-medium ${(order.status === s || ((order.status as string) === "pending" && s === "new")) ? "bg-whatsapp text-white" : "bg-neutral-100 dark:bg-neutral-800"}`}
                    >
                      {displayStatus(s)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {orders.length === 0 && <p className="mt-8 text-center text-ink-muted">ما كاين حتى طلب</p>}
        </>
      )}
    </AdminShell>
  );
}
