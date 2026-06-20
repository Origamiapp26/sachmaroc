"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { DashboardStats } from "@/types/product";
import type { SalesAnalytics } from "@/lib/analytics";
import AdminShell from "./AdminShell";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const ready = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);

  useEffect(() => {
    if (!ready) return;
    Promise.all([
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/analytics").then((r) => (r.ok ? r.json() : null)),
    ]).then(([s, a]) => {
      if (!s) router.push("/admin/login");
      else {
        setStats(s);
        setAnalytics(a);
      }
    });
  }, [ready, router]);

  const cards = stats
    ? [
        { label: "المنتجات", value: stats.totalProducts, color: "bg-blue-50 dark:bg-blue-950" },
        { label: "الطلبات", value: stats.totalOrders, color: "bg-green-50 dark:bg-green-950" },
        { label: "طلبات معلقة", value: stats.pendingOrders, color: "bg-amber-50 dark:bg-amber-950" },
        { label: "إيرادات", value: formatPrice(stats.totalRevenue), color: "bg-purple-50 dark:bg-purple-950" },
        { label: "متوسط الطلب", value: formatPrice(analytics?.averageOrderValue || 0), color: "bg-neutral-50 dark:bg-neutral-800" },
        { label: "الفئات", value: stats.totalCategories, color: "bg-neutral-50 dark:bg-neutral-800" },
      ]
    : [];

  const maxRevenue = Math.max(...(analytics?.revenueByMonth.map((m) => m.revenue) || [1]), 1);

  return (
    <AdminShell>
      {!ready ? (
        <p className="text-ink-muted">كيتحمّل...</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-ink dark:text-white">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-ink-muted">تحليلات المبيعات والإحصائيات</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/products/new" className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white dark:bg-whatsapp">+ إضافة منتج</Link>
            <a href="/api/admin/orders/export" className="rounded-xl border px-5 py-2.5 text-sm font-medium dark:border-neutral-700">تصدير الطلبات Excel</a>
            <a href="/api/admin/products/export" className="rounded-xl border px-5 py-2.5 text-sm font-medium dark:border-neutral-700">تصدير المنتجات JSON</a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className={`rounded-2xl p-6 ${card.color}`}>
                <p className="text-sm text-ink-muted">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-ink dark:text-white">{card.value}</p>
              </div>
            ))}
          </div>

          {analytics && (
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="font-bold text-ink dark:text-white">الإيرادات الشهرية</h2>
                <div className="mt-6 flex items-end gap-2 h-48">
                  {analytics.revenueByMonth.map((m) => (
                    <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg bg-whatsapp"
                        style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? "4px" : "0" }}
                      />
                      <span className="text-[10px] text-ink-muted">{m.month.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="font-bold text-ink dark:text-white">الأكثر مبيعاً</h2>
                <ul className="mt-4 space-y-3">
                  {analytics.topProducts.slice(0, 5).map((p) => (
                    <li key={p.productName} className="flex items-center justify-between text-sm">
                      <span className="text-ink dark:text-white">{p.productName}</span>
                      <span className="text-ink-muted">{p.quantity} مبيعة — {formatPrice(p.revenue)}</span>
                    </li>
                  ))}
                  {analytics.topProducts.length === 0 && (
                    <p className="text-sm text-ink-muted">ما كاين بيانات بعد</p>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
