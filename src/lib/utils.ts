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

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
};
