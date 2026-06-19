import HeroSection from "@/components/HeroSection";
import FeaturesBar from "@/components/FeaturesBar";
import ProductGrid from "@/components/ProductGrid";
import CategoriesSection from "@/components/CategoriesSection";
import ReviewsSection from "@/components/ReviewsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { getFeaturedProducts } from "@/lib/services/products";
import { getProducts } from "@/lib/services/products";
import { initDb } from "@/lib/init-db";

export default async function HomePage() {
  await initDb();
  const [featuredProducts, products] = await Promise.all([
    getFeaturedProducts(6),
    getProducts(),
  ]);
  const allReviews = products.flatMap((p) => p.reviews).slice(0, 6);
  const avgRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
      : 5;
  const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);

  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductGrid
          items={featuredProducts}
          subtitle="مختارات"
          title="منتجات مميزة"
          showViewAll
        />
      </div>
      <CategoriesSection />
      <WhyChooseUs />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ReviewsSection
          reviews={allReviews}
          rating={avgRating}
          reviewCount={totalReviews}
        />
      </div>
      <WhatsAppCTA />
    </>
  );
}
