import { MetadataRoute } from "next";
import { getProducts } from "@/lib/services/products";
import { initDb } from "@/lib/init-db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await initDb();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";
  const products = await getProducts();

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
