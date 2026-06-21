import { google } from "googleapis";
import type { Order, OrderStatus } from "@/types/product";

const SHEET_NAME = "Orders";
const HEADERS = [
  "Order Number",
  "Date",
  "Customer Name",
  "Phone",
  "City",
  "Address",
  "Notes",
  "Product Name",
  "Product ID",
  "Quantity",
  "Unit Price",
  "Shipping",
  "Discount",
  "Total",
  "Status",
];

export interface GoogleSheetsConfig {
  configured: boolean;
  sheetId: string;
  clientEmail: string;
}

export interface SheetsSyncResult {
  ok: boolean;
  rowsWritten: number;
  sheetId?: string;
  error?: string;
  durationMs: number;
  at: string;
}

export interface SheetOrderRow {
  orderId: string;
  date: string;
  productName: string;
  productId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  quantity: number;
  productPrice: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
}

function getClientEmail(): string {
  return (
    process.env.GOOGLE_CLIENT_EMAIL?.trim() ||
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() ||
    ""
  );
}

function getPrivateKey(): string {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "";
}

export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim() || "";
  const clientEmail = getClientEmail();
  return {
    configured: Boolean(sheetId && clientEmail && getPrivateKey()),
    sheetId,
    clientEmail,
  };
}

function isConfigured(): boolean {
  return getGoogleSheetsConfig().configured;
}

function getAuth() {
  return new google.auth.JWT({
    email: getClientEmail(),
    key: getPrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

function orderToRows(order: Order): string[][] {
  return order.items.map((item) => [
    order.orderNumber,
    order.createdAt,
    order.customerName,
    order.customerPhone,
    order.customerCity,
    order.customerAddress,
    order.notes ?? "",
    item.productName,
    item.productId ?? "",
    String(item.quantity),
    String(item.unitPrice),
    String(order.shippingCost),
    String(order.discount),
    String(order.total),
    order.status,
  ]);
}

function rowToOrder(row: string[]): Order {
  const [
    orderNumber,
    date,
    ,
    ,
    ,
    ,
    notes,
    productName,
    productId,
    quantity,
    unitPrice,
    shippingCost,
    discount,
    total,
    status,
  ] = row;

  const qty = Number(quantity) || 1;
  const price = Number(unitPrice) || 0;

  return {
    id: orderNumber,
    orderNumber,
    customerName: row[2] || "",
    customerPhone: row[3] || "",
    customerCity: row[4] || "",
    customerAddress: row[5] || "",
    notes: notes || "",
    subtotal: price * qty,
    shippingCost: Number(shippingCost) || 0,
    discount: Number(discount) || 0,
    couponCode: "",
    total: Number(total) || 0,
    status: (status?.toLowerCase() === "pending" ? "new" : status?.toLowerCase() || "new") as OrderStatus,
    createdAt: date || new Date().toISOString(),
    updatedAt: date || new Date().toISOString(),
    items: [
      {
        id: `${orderNumber}-item`,
        productId: productId || null,
        productName: productName || "",
        quantity: qty,
        unitPrice: price,
      },
    ],
  };
}

export async function ensureSheetHeaders(): Promise<void> {
  if (!isConfigured()) return;

  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:O1`,
  });

  if (!existing.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:O1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [HEADERS] },
    });
  }
}

/** Sync a full order to Google Sheets (one row per line item). */
export async function syncOrderToSheet(order: Order): Promise<SheetsSyncResult> {
  const config = getGoogleSheetsConfig();
  const at = new Date().toISOString();
  const started = Date.now();

  if (!config.configured) {
    return {
      ok: false,
      rowsWritten: 0,
      error: "Google Sheets غير مهيأ — عيّن GOOGLE_SHEET_ID و GOOGLE_CLIENT_EMAIL و GOOGLE_PRIVATE_KEY",
      durationMs: 0,
      at,
    };
  }

  try {
    await ensureSheetHeaders();

    const sheets = getSheetsClient();
    const values = orderToRows(order);

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.sheetId,
      range: `${SHEET_NAME}!A:O`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    const durationMs = Date.now() - started;
    console.info(
      `[google-sheets] synced ${order.orderNumber} (${values.length} row(s)) in ${durationMs}ms`
    );

    return {
      ok: true,
      rowsWritten: values.length,
      sheetId: config.sheetId,
      durationMs,
      at,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[google-sheets] sync failed:", message);
    return {
      ok: false,
      rowsWritten: 0,
      sheetId: config.sheetId,
      error: message,
      durationMs: Date.now() - started,
      at,
    };
  }
}

/** Admin / debug test row */
export async function syncTestOrderToSheet(): Promise<SheetsSyncResult> {
  const now = new Date().toISOString();
  return syncOrderToSheet({
    id: "test",
    orderNumber: "TEST-001",
    customerName: "Sheets API Test",
    customerPhone: "0600000000",
    customerCity: "Casablanca",
    customerAddress: "Test",
    notes: "Automated Google Sheets API test",
    subtotal: 100,
    shippingCost: 0,
    discount: 0,
    couponCode: "",
    total: 100,
    status: "new",
    createdAt: now,
    updatedAt: now,
    items: [
      {
        id: "test-item",
        productId: "test",
        productName: "Test Product",
        quantity: 1,
        unitPrice: 100,
      },
    ],
  });
}

export async function appendOrderToSheet(row: SheetOrderRow): Promise<void> {
  const result = await syncOrderToSheet({
    id: row.orderId,
    orderNumber: row.orderId,
    customerName: row.customerName,
    customerPhone: row.phone,
    customerCity: row.city,
    customerAddress: row.address,
    notes: row.notes,
    subtotal: row.productPrice * row.quantity,
    shippingCost: row.shippingCost,
    discount: row.discount,
    couponCode: "",
    total: row.total,
    status: row.status,
    createdAt: row.date,
    updatedAt: row.date,
    items: [
      {
        id: `${row.orderId}-item`,
        productId: row.productId,
        productName: row.productName,
        quantity: row.quantity,
        unitPrice: row.productPrice,
      },
    ],
  });

  if (!result.ok) {
    throw new Error(result.error || "Google Sheets sync failed");
  }
}

export async function getOrdersFromSheet(status?: OrderStatus): Promise<Order[]> {
  if (!isConfigured()) return [];

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEET_NAME}!A2:O`,
  });

  const rows = res.data.values || [];
  let orders = rows.filter((r) => r[0]).map(rowToOrder);

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderFromSheetById(orderId: string): Promise<Order | null> {
  const orders = await getOrdersFromSheet();
  return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
}

export async function updateOrderStatusInSheet(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  if (!isConfigured()) return null;

  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:O`,
  });

  const rows = res.data.values || [];
  const updates: { range: string; values: string[][] }[] = [];

  rows.forEach((row, index) => {
    if (row[0] === orderId) {
      updates.push({
        range: `${SHEET_NAME}!O${index + 2}`,
        values: [[status]],
      });
    }
  });

  if (!updates.length) return null;

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: updates,
    },
  });

  const updated = [...rows.find((r) => r[0] === orderId)!];
  updated[14] = status;
  const order = rowToOrder(updated);
  order.updatedAt = new Date().toISOString();
  return order;
}

export { isConfigured as isGoogleSheetsConfigured };
