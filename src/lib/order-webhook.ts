import type { Order } from "@/types/product";

/** يرسل بيانات الطلب لـ Google Sheets webhook (Apps Script) */
export async function sendOrderWebhook(
  order: Order,
  webhookUrl: string
): Promise<void> {
  const url = webhookUrl.trim();
  if (!url) return;

  const primary = order.items[0];

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.orderNumber,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        customerName: order.customerName,
        phone: order.customerPhone,
        city: order.customerCity,
        address: order.customerAddress,
        notes: order.notes,
        quantity: primary?.quantity ?? 0,
        productName: primary?.productName ?? "",
        productId: primary?.productId ?? "",
        productPrice: primary?.unitPrice ?? 0,
        shippingCost: order.shippingCost,
        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,
        status: order.status,
        items: order.items,
      }),
    });
  } catch (err) {
    console.error("[order-webhook] failed:", err);
  }
}
