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
    productId: string | null;
    productName: string;
    quantity: number;
    unitPrice: number;
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
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

/** يرسل بيانات الطلب لـ Google Sheets webhook (Apps Script) */
export async function sendOrderWebhook(
  order: Order,
  webhookUrl: string
): Promise<WebhookDeliveryResult | null> {
  const url = webhookUrl.trim();
  if (!url) return null;

  const payload = buildOrderWebhookPayload(order);
  const at = new Date().toISOString();
  const started = Date.now();

  console.info("[order-webhook] POST", url);
  console.info("[order-webhook] payload:", JSON.stringify(payload));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const responseBody = await response.text();
    const durationMs = Date.now() - started;

    const result: WebhookDeliveryResult = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseBody: responseBody.slice(0, 2000),
      payload,
      url,
      durationMs,
      at,
    };

    if (response.ok) {
      console.info(
        `[order-webhook] success ${response.status} in ${durationMs}ms:`,
        responseBody.slice(0, 500)
      );
    } else {
      result.error =
        response.status === 401
          ? "HTTP 401 — redeploy Apps Script as Web app with « Who has access: Anyone »"
          : `HTTP ${response.status} ${response.statusText}`;
      console.error("[order-webhook] failed:", result.error, responseBody.slice(0, 500));
    }

    return result;
  } catch (err) {
    const durationMs = Date.now() - started;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[order-webhook] error:", message);

    return {
      ok: false,
      status: 0,
      statusText: "Network Error",
      responseBody: "",
      payload,
      url,
      durationMs,
      error: message,
      at,
    };
  }
}

export function buildTestWebhookPayload(): OrderWebhookPayload {
  return {
    orderNumber: "SM-TEST-WEBHOOK",
    customerName: "Test Webhook SachMaroc",
    phone: "0600000000",
    city: "الدار البيضاء",
    address: "Test address — webhook ping",
    notes: "Automated webhook test — safe to delete",
    total: 350,
    items: [
      {
        productId: "test",
        productName: "Webhook Test Product",
        quantity: 1,
        unitPrice: 350,
      },
    ],
  };
}

export async function sendTestWebhook(
  webhookUrl: string
): Promise<WebhookDeliveryResult> {
  const url = webhookUrl.trim();
  const payload = buildTestWebhookPayload();
  const at = new Date().toISOString();
  const started = Date.now();

  console.info("[order-webhook] TEST POST", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const responseBody = await response.text();
    const durationMs = Date.now() - started;

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseBody: responseBody.slice(0, 2000),
      payload,
      url,
      durationMs,
      error: response.ok ? undefined : `HTTP ${response.status} ${response.statusText}`,
      at,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: 0,
      statusText: "Network Error",
      responseBody: "",
      payload,
      url,
      durationMs: Date.now() - started,
      error: message,
      at,
    };
  }
}
