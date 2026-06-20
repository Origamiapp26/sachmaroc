import type { Order } from "@/types/product";

/** Payload expected by Google Apps Script webhook */
export interface OrderWebhookPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  total: number;
  items: {
    productId?: string | null;
    productName?: string;
    name?: string;
    quantity: number;
    unitPrice?: number;
  }[];
}

export interface WebhookDeliveryResult {
  ok: boolean;
  status: number;
  statusText: string;
  responseBody: string;
  payload: OrderWebhookPayload;
  url: string;
  durationMs: number;
  error?: string;
  at: string;
}

export function buildOrderWebhookPayload(order: Order): OrderWebhookPayload {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    phone: order.customerPhone,
    city: order.customerCity,
    address: order.customerAddress,
    notes: order.notes ?? "",
    total: order.total,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      name: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

/** Debug / manual test payload (matches Apps Script test format) */
export function buildDebugWebhookPayload(): OrderWebhookPayload {
  return {
    orderNumber: "TEST-001",
    customerName: "Webhook Test",
    phone: "0600000000",
    city: "Casablanca",
    address: "Test",
    notes: "",
    total: 100,
    items: [{ name: "Test Product", productName: "Test Product", quantity: 1 }],
  };
}

function logWebhookResult(
  label: string,
  url: string,
  payload: OrderWebhookPayload,
  result: Omit<WebhookDeliveryResult, "payload" | "url" | "at"> & { at?: string }
): WebhookDeliveryResult {
  const full: WebhookDeliveryResult = {
    ...result,
    payload,
    url,
    at: result.at ?? new Date().toISOString(),
  };

  console.info(`[order-webhook] ${label}`);
  console.info("[order-webhook] URL:", url);
  console.info("[order-webhook] request payload:", JSON.stringify(payload));
  console.info("[order-webhook] response status:", full.status, full.statusText);
  console.info("[order-webhook] response body:", full.responseBody || "(empty)");
  if (full.error) console.error("[order-webhook] error:", full.error);

  return full;
}

/** POST JSON to webhook — shared by orders and debug endpoint */
export async function postOrderWebhook(
  webhookUrl: string,
  payload: OrderWebhookPayload,
  label = "POST"
): Promise<WebhookDeliveryResult> {
  const url = webhookUrl.trim();
  const at = new Date().toISOString();
  const started = Date.now();

  if (!url) {
    return logWebhookResult(label, url, payload, {
      ok: false,
      status: 0,
      statusText: "No URL",
      responseBody: "",
      durationMs: 0,
      error: "googleSheetsWebhookUrl is empty",
      at,
    });
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const responseBody = await response.text();
    const durationMs = Date.now() - started;

    let error: string | undefined;
    if (!response.ok) {
      error =
        response.status === 401
          ? "HTTP 401 — Apps Script must be deployed with Who has access: Anyone"
          : `HTTP ${response.status} ${response.statusText}`;
    }

    return logWebhookResult(label, url, payload, {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseBody,
      durationMs,
      error,
      at,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return logWebhookResult(label, url, payload, {
      ok: false,
      status: 0,
      statusText: "Network Error",
      responseBody: "",
      durationMs: Date.now() - started,
      error: message,
      at,
    });
  }
}

export async function sendOrderWebhook(
  order: Order,
  webhookUrl: string
): Promise<WebhookDeliveryResult | null> {
  const url = webhookUrl.trim();
  if (!url) return null;
  return postOrderWebhook(url, buildOrderWebhookPayload(order), "ORDER");
}

export async function sendDebugWebhook(
  webhookUrl: string
): Promise<WebhookDeliveryResult> {
  return postOrderWebhook(webhookUrl, buildDebugWebhookPayload(), "DEBUG");
}

/** @deprecated use sendDebugWebhook */
export async function sendTestWebhook(
  webhookUrl: string
): Promise<WebhookDeliveryResult> {
  return sendDebugWebhook(webhookUrl);
}

export function buildTestWebhookPayload(): OrderWebhookPayload {
  return buildDebugWebhookPayload();
}
