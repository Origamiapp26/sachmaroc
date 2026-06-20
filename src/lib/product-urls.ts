import type { Product } from "@/types/product";

export function getProductSlug(product: Pick<Product, "id" | "slug">): string {
  if (product.slug?.trim()) return product.slug.trim();
  return `product-${product.id}`;
}

export function getLandingUrl(
  product: Pick<Product, "id" | "slug">,
  baseUrl?: string
): string {
  const base =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://sachmaroc.ma";
  return `${base}/landing/${getProductSlug(product)}`;
}

export function getProductPageUrl(
  id: string,
  baseUrl?: string
): string {
  const base =
    baseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://sachmaroc.ma";
  return `${base}/products/${id}`;
}
