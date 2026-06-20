import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import RelatedProducts from "@/components/RelatedProducts";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  const settings = getSettings();
  if (!product) return { title: "منتج غير موجود" };

  const title = `${product.name} | ${settings.storeName}`;
  const description = product.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
      locale: "ar_MA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";
  const productUrl = `${baseUrl}/products/${id}`;

  const jsonLd = [
    productJsonLd(product, baseUrl),
    breadcrumbJsonLd([
      { name: "الرئيسية", url: baseUrl },
      { name: "المنتجات", url: `${baseUrl}/products` },
      { name: product.name, url: productUrl },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} productUrl={productUrl} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RelatedProducts products={related} />
      </div>
    </>
  );
}
