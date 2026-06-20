import { WHATSAPP_NUMBER } from "@/lib/config";
import type { Product } from "@/types/product";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** رسالة واتساب لمنتج واحد — فيها الاسم، الثمن، والرابط */
export function buildWhatsAppProductUrl(
  product: Product,
  productUrl: string
): string {
  const number = product.whatsappNumber || WHATSAPP_NUMBER;
  const message = [
    "السلام عليكم SachMaroc 👋",
    "",
    `بغيت نطلب: *${product.name}*`,
    `الثمن: ${formatPrice(product.price)}`,
    `الرابط: ${productUrl}`,
    "",
    "شكراً!",
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderUrl(
  items: { name: string; quantity: number; price: number }[],
  total: number,
  orderNumber?: string
): string {
  const lines = items.map(
    (item) =>
      `• ${item.name} ×${item.quantity} — ${formatPrice(item.price * item.quantity)}`
  );

  const message = [
    "السلام عليكم SachMaroc 👋",
    "",
    orderNumber ? `طلب رقم: *${orderNumber}*` : "بغيت نطلب:",
    "",
    ...lines,
    "",
    `*المجموع: ${formatPrice(total)}*`,
    "",
    "طريقة الدفع: الدفع عند الاستلام",
    "",
    "شكراً!",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppContactUrl(message?: string, number?: string): string {
  const text = message || "السلام عليكم، عندي سؤال على منتجاتكم.";
  const num = number || WHATSAPP_NUMBER;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

/** رسالة واتساب كاملة بعد طلب مباشر من صفحة المنتج */
export function buildWhatsAppDirectOrderUrl(
  order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerAddress: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    shippingCost: number;
    total: number;
    productUrl?: string;
  },
  number?: string
): string {
  const num = number || WHATSAPP_NUMBER;
  const subtotal = order.unitPrice * order.quantity;

  const message = [
    "السلام عليكم SachMaroc 👋",
    "",
    `*طلب جديد #${order.orderNumber}*`,
    "",
    `📦 المنتج: ${order.productName}`,
    `🔢 الكمية: ${order.quantity}`,
    `💰 ثمن المنتج: ${formatPrice(subtotal)}`,
    `🚚 التوصيل (${order.customerCity}): ${formatPrice(order.shippingCost)}`,
    `*المجموع: ${formatPrice(order.total)}*`,
    "",
    "👤 معلومات الزبون:",
    `الاسم: ${order.customerName}`,
    `الهاتف: ${order.customerPhone}`,
    `المدينة: ${order.customerCity}`,
    `العنوان: ${order.customerAddress}`,
    "",
    order.productUrl ? `🔗 ${order.productUrl}` : "",
    "💵 الدفع عند الاستلام",
    "",
    "شكراً!",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  pending: "جديد",
  confirmed: "مؤكد",
  shipped: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
};
