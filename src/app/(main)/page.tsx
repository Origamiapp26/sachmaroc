import HeroSection from "@/components/HeroSection";
import FeaturesBar from "@/components/FeaturesBar";
import ProductGrid from "@/components/ProductGrid";
import CategoriesSection from "@/components/CategoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DeliverySection from "@/components/DeliverySection";
import WhyChooseUs from "@/components/WhyChooseUs";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import {
  getFeaturedProducts,
  getBestSellerProducts,
  getNewArrivalProducts,
} from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellerProducts();
  const newArrivals = getNewArrivalProducts();
  const settings = getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";

  const jsonLd = [organizationJsonLd(settings, baseUrl), websiteJsonLd(settings, baseUrl)];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductGrid items={featured} subtitle="مختارات" title="منتجات مميزة" showViewAll />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductGrid items={bestSellers} subtitle="الأكثر طلباً" title="الأكثر مبيعاً" showViewAll />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductGrid items={newArrivals} subtitle="جديد" title="وافدات جديدة" showViewAll />
      </div>
      <CategoriesSection />
      <TestimonialsSection />
      <DeliverySection />
      <WhyChooseUs />
      <WhatsAppCTA />
    </>
  );
}
