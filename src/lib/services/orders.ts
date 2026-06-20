import { eq, desc, sql, count, and, or, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import type { Order, OrderStatus } from "@/types/product";
import { getProducts, getCategories } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { sendOrderWebhook } from "@/lib/order-webhook";
import {
  appendOrderToSheet,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";

export interface OrderFilters {
  status?: OrderStatus;
  city?: string;
  search?: string;
}

function normalizeStatus(status: string): OrderStatus {
  if (status === "pending") return "new";
  return status as OrderStatus;
}

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
    subtotal: row.subtotal ?? row.total,
    shippingCost: row.shippingCost ?? 0,
    discount: row.discount ?? 0,
    couponCode: row.couponCode ?? "",
    total: row.total,
    status: normalizeStatus(row.status),
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

async function findOrderRow(idOrNumber: string) {
  return db.query.orders.findFirst({
    where: or(eq(orders.id, idOrNumber), eq(orders.orderNumber, idOrNumber)),
  });
}

function generateOrderNumber(): string {
  const date = new Date();
  const prefix = `SM${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

async function generateUniqueOrderNumber(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const orderNumber = generateOrderNumber();
    const existing = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
    });
    if (!existing) return orderNumber;
  }
  return `${generateOrderNumber()}-${nanoid(4)}`;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  couponCode?: string;
  shippingCost?: number;
  discount?: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const orderNumber = await generateUniqueOrderNumber();
  const now = new Date().toISOString();
  const id = nanoid();

  const subtotal = input.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const shippingCost = input.shippingCost ?? 0;
  const discount = input.discount ?? 0;
  const total = Math.max(0, subtotal + shippingCost - discount);

  await db.insert(orders).values({
    id,
    orderNumber,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerCity: input.customerCity,
    customerAddress: input.customerAddress,
    notes: input.notes ?? "",
    subtotal,
    shippingCost,
    discount,
    couponCode: input.couponCode ?? "",
    total,
    status: "new",
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
  }

  const order = (await getOrderById(id))!;

  const { googleSheetsWebhookUrl } = getSettings();
  if (googleSheetsWebhookUrl) {
    void sendOrderWebhook(order, googleSheetsWebhookUrl);
  }

  if (isGoogleSheetsConfigured()) {
    const primary = input.items[0];
    void appendOrderToSheet({
      orderId: orderNumber,
      date: now,
      productName: primary.productName,
      productId: primary.productId,
      customerName: input.customerName,
      phone: input.customerPhone,
      city: input.customerCity,
      address: input.customerAddress,
      quantity: primary.quantity,
      productPrice: primary.unitPrice,
      shippingCost,
      total,
      status: "new",
    }).catch((err) => console.error("[google-sheets] sync failed:", err));
  }

  return order;
}

export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  const conditions = [];

  if (filters?.status) {
    const status = filters.status;
    if (status === "new") {
      conditions.push(or(eq(orders.status, "new"), eq(orders.status, "pending")));
    } else {
      conditions.push(eq(orders.status, status));
    }
  }

  if (filters?.city) {
    conditions.push(eq(orders.customerCity, filters.city));
  }

  if (filters?.search?.trim()) {
    const q = `%${filters.search.trim()}%`;
    conditions.push(
      or(like(orders.customerName, q), like(orders.customerPhone, q))
    );
  }

  const rows = await db.query.orders.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: desc(orders.createdAt),
  });

  return Promise.all(rows.map(hydrateOrder));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await findOrderRow(id);
  return row ? hydrateOrder(row) : null;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  return getOrderById(orderNumber);
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const rows = await db.query.orders.findMany({
    where: eq(orders.customerPhone, phone),
    orderBy: desc(orders.createdAt),
  });
  return Promise.all(rows.map(hydrateOrder));
}

export async function getOrderCities(): Promise<string[]> {
  const rows = await db.select({ city: orders.customerCity }).from(orders);
  return [...new Set(rows.map((r) => r.city))].sort();
}

export async function updateOrderStatus(
  idOrNumber: string,
  status: OrderStatus
): Promise<Order | null> {
  const row = await findOrderRow(idOrNumber);
  if (!row) return null;

  await db
    .update(orders)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(orders.id, row.id));

  return getOrderById(row.id);
}

export async function getDashboardStats() {
  const allProducts = getProducts();
  const categoryNames = getCategories().filter((c) => c !== "الكل");

  const [orderCount] = await db.select({ count: count() }).from(orders);
  const [pendingCount] = await db
    .select({ count: count() })
    .from(orders)
    .where(or(eq(orders.status, "new"), eq(orders.status, "pending")));
  const [revenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(${orders.total}), 0)` })
    .from(orders)
    .where(eq(orders.status, "delivered"));

  return {
    totalProducts: allProducts.length,
    totalOrders: orderCount.count,
    pendingOrders: pendingCount.count,
    totalRevenue: revenue.total ?? 0,
    lowStockProducts: allProducts.filter((p) => !p.inStock).length,
    totalCategories: categoryNames.length,
  };
}

export async function exportOrdersCsv(filters?: OrderFilters): Promise<string> {
  const allOrders = await getOrders(filters);
  const headers = [
    "رقم الطلب",
    "الاسم",
    "الهاتف",
    "المدينة",
    "العنوان",
    "ملاحظات",
    "المجموع الفرعي",
    "التوصيل",
    "الخصم",
    "المجموع",
    "الحالة",
    "التاريخ",
    "المنتجات",
  ];

  const rows = allOrders.map((o) => [
    o.orderNumber,
    o.customerName,
    o.customerPhone,
    o.customerCity,
    o.customerAddress,
    o.notes,
    o.subtotal,
    o.shippingCost,
    o.discount,
    o.total,
    o.status,
    o.createdAt,
    o.items.map((i) => `${i.productName}×${i.quantity}`).join(" | "),
  ]);

  const bom = "\uFEFF";
  return (
    bom +
    [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
  );
}
