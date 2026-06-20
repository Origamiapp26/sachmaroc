/** Facebook Pixel + Google Analytics 4 — client-side only */

export interface TrackingProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity?: number;
}

export interface PurchasePayload {
  orderNumber: string;
  total: number;
  shippingCost?: number;
  items: TrackingProduct[];
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gaItems(items: TrackingProduct[]) {
  return items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity ?? 1,
  }));
}

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
  window.gtag?.("event", "page_view");
}

export function trackViewContent(product: TrackingProduct): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    content_category: product.category,
    value: product.price,
    currency: "MAD",
  });
  window.gtag?.("event", "view_item", {
    currency: "MAD",
    value: product.price,
    items: gaItems([product]),
  });
}

export function trackAddToCart(product: TrackingProduct, quantity = 1): void {
  if (typeof window === "undefined") return;
  const value = product.price * quantity;
  window.fbq?.("track", "AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value,
    currency: "MAD",
  });
  window.gtag?.("event", "add_to_cart", {
    currency: "MAD",
    value,
    items: gaItems([{ ...product, quantity }]),
  });
}

export function trackInitiateCheckout(
  items: TrackingProduct[],
  total: number
): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    num_items: items.reduce((s, i) => s + (i.quantity ?? 1), 0),
    value: total,
    currency: "MAD",
  });
  window.gtag?.("event", "begin_checkout", {
    currency: "MAD",
    value: total,
    items: gaItems(items),
  });
}

export function trackPurchase(payload: PurchasePayload): void {
  if (typeof window === "undefined") return;
  const { orderNumber, total, items } = payload;
  window.fbq?.("track", "Purchase", {
    content_ids: items.map((i) => i.id),
    content_type: "product",
    value: total,
    currency: "MAD",
  });
  window.gtag?.("event", "purchase", {
    transaction_id: orderNumber,
    currency: "MAD",
    value: total,
    shipping: payload.shippingCost ?? 0,
    items: gaItems(items),
  });
}
