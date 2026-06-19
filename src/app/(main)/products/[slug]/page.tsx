import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/services/products";
import { initDb } from "@/lib/init-db";
import ProductDetailClient from "@/components/ProductDetailClient";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await initDb();
  const product = await getProductBySlug(slug);
  if (!product) return { title: "منتج غير موجود" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  await initDb();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
