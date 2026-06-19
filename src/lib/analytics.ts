import { eq, desc, sql, count, and, gte } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";

export interface SalesAnalytics {
  revenueByMonth: { month: string; revenue: number; orders: number }[];
  topProducts: { productId: string; productName: string; quantity: number; revenue: number }[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
}

export async function getSalesAnalytics(): Promise<SalesAnalytics> {
  const allOrders = await db.query.orders.findMany({
    orderBy: desc(orders.createdAt),
  });

  const delivered = allOrders.filter((o) => o.status === "delivered");
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const totalOrders = allOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / delivered.length || 0 : 0;

  const monthMap = new Map<string, { revenue: number; orders: number }>();
  for (const order of allOrders) {
    const month = order.createdAt.slice(0, 7);
    const entry = monthMap.get(month) || { revenue: 0, orders: 0 };
    entry.orders += 1;
    if (order.status === "delivered") entry.revenue += order.total;
    monthMap.set(month, entry);
  }

  const revenueByMonth = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({ month, ...data }));

  const statusCounts: Record<string, number> = {};
  for (const order of allOrders) {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  }

  const topRows = await db
    .select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      quantity: sql<number>`SUM(${orderItems.quantity})`,
      revenue: sql<number>`SUM(${orderItems.quantity} * ${orderItems.unitPrice})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .groupBy(orderItems.productId, orderItems.productName)
    .orderBy(desc(sql`SUM(${orderItems.quantity})`))
    .limit(10);

  return {
    revenueByMonth,
    topProducts: topRows.map((r) => ({
      productId: r.productId || "",
      productName: r.productName,
      quantity: r.quantity,
      revenue: r.revenue,
    })),
    totalRevenue,
    totalOrders,
    averageOrderValue: Math.round(averageOrderValue),
    ordersByStatus: statusCounts,
  };
}

export async function getRecentOrdersCount(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const [result] = await db
    .select({ count: count() })
    .from(orders)
    .where(gte(orders.createdAt, since.toISOString()));
  return result.count;
}
