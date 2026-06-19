import { eq, desc, and, gte, lte, sql, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { orders, orderItems, products, categories } from "@/db/schema";
import type { Order, OrderStatus } from "@/types/product";
import { decrementStock } from "./products";

async function hydrateOrder(row: typeof orders.$inferSelect): Promise<Order> {
  const items = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, row.id),
  });

  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerCity: row.customerCity,
    customerAddress: row.customerAddress,
    notes: row.notes ?? "",
    total: row.total,
    status: row.status as OrderStatus,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items: items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  };
}

function generateOrderNumber(): string {
  const date = new Date();
  const prefix = `SM${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const id = nanoid();
  const now = new Date().toISOString();
  const orderNumber = generateOrderNumber();
  const total = input.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  await db.insert(orders).values({
    id,
    orderNumber,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerCity: input.customerCity,
    customerAddress: input.customerAddress,
    notes: input.notes ?? "",
    total,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  for (const item of input.items) {
    await db.insert(orderItems).values({
      id: nanoid(),
      orderId: id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
    await decrementStock(item.productId, item.quantity);
  }

  return (await getOrderById(id))!;
}

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  const rows = await db.query.orders.findMany({
    where: status ? eq(orders.status, status) : undefined,
    orderBy: desc(orders.createdAt),
  });
  return Promise.all(rows.map(hydrateOrder));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  return row ? hydrateOrder(row) : null;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  const row = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
  });
  return row ? hydrateOrder(row) : null;
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const rows = await db.query.orders.findMany({
    where: eq(orders.customerPhone, phone),
    orderBy: desc(orders.createdAt),
  });
  return Promise.all(rows.map(hydrateOrder));
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  await db
    .update(orders)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(orders.id, id));
  return getOrderById(id);
}

export async function getDashboardStats() {
  const [productCount] = await db.select({ count: count() }).from(products);
  const [orderCount] = await db.select({ count: count() }).from(orders);
  const [pendingCount] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const [revenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(${orders.total}), 0)` })
    .from(orders)
    .where(eq(orders.status, "delivered"));
  const [lowStock] = await db
    .select({ count: count() })
    .from(products)
    .where(and(eq(products.inStock, true), lte(products.stockQuantity, 5)));
  const [categoryCount] = await db.select({ count: count() }).from(categories);

  return {
    totalProducts: productCount.count,
    totalOrders: orderCount.count,
    pendingOrders: pendingCount.count,
    totalRevenue: revenue.total ?? 0,
    lowStockProducts: lowStock.count,
    totalCategories: categoryCount.count,
  };
}
