import { notFound } from "next/navigation";
import { getProductBySlug, getAllLandingSlugs } from "@/lib/products";
import { getLandingUrl } from "@/lib/product-urls";
import { getSettings } from "@/lib/settings";
import { resolveLandingContent } from "@/lib/landing";
import LandingPageClient from "@/components/landing/LandingPageClient";
import { productJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllLandingSlugs().map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const settings = getSettings();
  if (!product) return { title: "الصفحة غير موجودة" };

  const headline = product.landing?.headline || product.name;
  const description =
    product.landing?.subheadline || product.description.slice(0, 160);

  return {
    title: headline,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title: headline,
      description,
      images: [{ url: product.image, width: 1200, height: 1200, alt: product.name }],
      type: "website",
      locale: "ar_MA",
      siteName: settings.storeName,
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description,
      images: [product.image],
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const settings = getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";
  const landingUrl = getLandingUrl(product, baseUrl);
  const content = resolveLandingContent(product, settings, baseUrl);

  const jsonLd = productJsonLd(product, baseUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageClient
        product={product}
        content={content}
        landingUrl={landingUrl}
      />
    </>
  );
}
