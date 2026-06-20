import type { WebhookDeliveryResult } from "@/lib/order-webhook";

const MAX_ENTRIES = 30;

export interface WebhookLogEntry extends WebhookDeliveryResult {
  orderNumber: string;
  kind: "order" | "test";
}

const log: WebhookLogEntry[] = [];

export function recordWebhookDelivery(
  orderNumber: string,
  kind: "order" | "test",
  result: WebhookDeliveryResult
): void {
  log.unshift({
    ...result,
    orderNumber,
    kind,
  });
  if (log.length > MAX_ENTRIES) log.length = MAX_ENTRIES;
}

export function getWebhookLog(limit = 10): WebhookLogEntry[] {
  return log.slice(0, limit);
}

export function getLastWebhookForOrder(
  orderNumber: string
): WebhookLogEntry | undefined {
  return log.find((e) => e.orderNumber === orderNumber && e.kind === "order");
}
