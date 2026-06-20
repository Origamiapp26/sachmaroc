import HeroSlider from "@/components/HeroSlider";
import TrustBar from "@/components/TrustBar";
import ProductGrid from "@/components/ProductGrid";
import CategoriesSection from "@/components/CategoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DeliverySection from "@/components/DeliverySection";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import {
  getFeaturedProducts,
  getBestSellerProducts,
  getNewArrivalProducts,
  getProducts,
} from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { resolveHeroSlides, getDefaultHeroSlides } from "@/lib/hero-slides";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const settings = getSettings();
  const products = getProducts();
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellerProducts();
  const newArrivals = getNewArrivalProducts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";

  const heroSlides =
    settings.heroSlides?.length > 0
      ? resolveHeroSlides(settings.heroSlides)
      : resolveHeroSlides(getDefaultHeroSlides(products));

  const { homepage } = settings;
  const jsonLd = [organizationJsonLd(settings, baseUrl), websiteJsonLd(settings, baseUrl)];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSlider slides={heroSlides} />
      <TrustBar />

      {homepage.featured.enabled && featured.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ProductGrid
            items={featured}
            subtitle={homepage.featured.subtitle}
            title={homepage.featured.title}
            showViewAll
          />
        </div>
      )}

      {homepage.bestSellers.enabled && bestSellers.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductGrid
            items={bestSellers}
            subtitle={homepage.bestSellers.subtitle}
            title={homepage.bestSellers.title}
            showViewAll
          />
        </div>
      )}

      {homepage.newArrivals.enabled && newArrivals.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductGrid
            items={newArrivals}
            subtitle={homepage.newArrivals.subtitle}
            title={homepage.newArrivals.title}
            showViewAll
          />
        </div>
      )}

      {homepage.categories.enabled && (
        <CategoriesSection
          subtitle={homepage.categories.subtitle}
          title={homepage.categories.title}
        />
      )}

      {homepage.reviews.enabled && <TestimonialsSection />}

      <DeliverySection />
      <WhatsAppCTA />
    </>
  );
}
