import { google } from "googleapis";
import type { Order, OrderStatus } from "@/types/product";

const SHEET_NAME = "Orders";
const HEADERS = [
  "Order ID",
  "Date",
  "Product Name",
  "Product ID",
  "Customer Name",
  "Phone",
  "City",
  "Address",
  "Quantity",
  "Product Price",
  "Shipping Cost",
  "Total",
  "Status",
];

export interface SheetOrderRow {
  orderId: string;
  date: string;
  productName: string;
  productId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  productPrice: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
}

function isConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

function getAuth() {
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

function rowToOrder(row: string[]): Order {
  const [
    orderId,
    date,
    productName,
    productId,
    customerName,
    phone,
    city,
    address,
    quantity,
    productPrice,
    shippingCost,
    total,
    status,
  ] = row;

  const qty = Number(quantity) || 1;
  const unitPrice = Number(productPrice) || 0;
  const subtotal = unitPrice * qty;

  return {
    id: orderId,
    orderNumber: orderId,
    customerName: customerName || "",
    customerPhone: phone || "",
    customerCity: city || "",
    customerAddress: address || "",
    notes: "",
    subtotal,
    shippingCost: Number(shippingCost) || 0,
    discount: 0,
    couponCode: "",
    total: Number(total) || 0,
    status: (status?.toLowerCase() === "pending" ? "new" : status?.toLowerCase() || "new") as OrderStatus,
    createdAt: date || new Date().toISOString(),
    updatedAt: date || new Date().toISOString(),
    items: [
      {
        id: `${orderId}-item`,
        productId: productId || null,
        productName: productName || "",
        quantity: qty,
        unitPrice,
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
    range: `${SHEET_NAME}!A1:M1`,
  });

  if (!existing.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:M1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [HEADERS] },
    });
  }
}

export async function appendOrderToSheet(row: SheetOrderRow): Promise<void> {
  if (!isConfigured()) {
    throw new Error("Google Sheets غير مهيأ — عيّن متغيرات البيئة");
  }

  await ensureSheetHeaders();

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEET_NAME}!A:M`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          row.orderId,
          row.date,
          row.productName,
          row.productId,
          row.customerName,
          row.phone,
          row.city,
          row.address,
          row.quantity,
          row.productPrice,
          row.shippingCost,
          row.total,
          row.status,
        ],
      ],
    },
  });
}

export async function getOrdersFromSheet(status?: OrderStatus): Promise<Order[]> {
  if (!isConfigured()) return [];

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: `${SHEET_NAME}!A2:M`,
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
    range: `${SHEET_NAME}!A2:M`,
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === orderId);
  if (rowIndex === -1) return null;

  const sheetRow = rowIndex + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!M${sheetRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[status]] },
  });

  const updated = [...rows[rowIndex]];
  updated[12] = status;
  const order = rowToOrder(updated);
  order.updatedAt = new Date().toISOString();
  return order;
}

export { isConfigured as isGoogleSheetsConfigured };
