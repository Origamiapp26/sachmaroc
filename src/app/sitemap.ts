import { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { getProductSlug } from "@/lib/product-urls";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";
  const products = getProducts();
  const now = new Date();

  const staticPages = ["/", "/products", "/about", "/contact", "/faq", "/terms", "/privacy", "/orders"];

  return [
    ...staticPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : 0.6,
    })),
    ...products.map((p) => ({
      url: `${base}/products/${p.id}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/landing/${getProductSlug(p)}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.95,
    })),
  ];
}
