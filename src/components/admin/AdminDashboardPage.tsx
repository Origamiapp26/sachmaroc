"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { DashboardStats } from "@/types/product";
import AdminShell from "./AdminShell";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) router.push("/admin/login");
      });
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, [router]);

  const cards = stats
    ? [
        { label: "المنتجات", value: stats.totalProducts, color: "bg-blue-50 dark:bg-blue-950" },
        { label: "الطلبات", value: stats.totalOrders, color: "bg-green-50 dark:bg-green-950" },
        { label: "طلبات معلقة", value: stats.pendingOrders, color: "bg-amber-50 dark:bg-amber-950" },
        { label: "إيرادات", value: formatPrice(stats.totalRevenue), color: "bg-purple-50 dark:bg-purple-950" },
        { label: "مخزون منخفض", value: stats.lowStockProducts, color: "bg-red-50 dark:bg-red-950" },
        { label: "الفئات", value: stats.totalCategories, color: "bg-neutral-50 dark:bg-neutral-800" },
      ]
    : [];

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">لوحة التحكم</h1>
      <p className="mt-1 text-sm text-ink-muted">مرحبا فإدارة SachMaroc</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl p-6 ${card.color}`}
          >
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
