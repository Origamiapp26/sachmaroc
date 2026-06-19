import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeaturesBar from "@/components/FeaturesBar";
import ProductGrid from "@/components/ProductGrid";
import ReviewsSection from "@/components/ReviewsSection";
import { products } from "@/data/products";

const featuredProducts = products.filter((p) => p.badge).slice(0, 3);
const allReviews = products.flatMap((p) => p.reviews).slice(0, 3);
const avgRating =
  products.reduce((sum, p) => sum + p.rating, 0) / products.length;
const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesBar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductGrid
          items={featuredProducts}
          subtitle="Sélection"
          title="Nos pièces phares"
          showViewAll
        />
      </div>

      {/* Editorial banner */}
      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        <div className="absolute inset-0 bg-hero-glow opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-400">
            Artisanat & Luxe
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Chaque pièce raconte une histoire du Maroc
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
            Des matériaux nobles, des finitions impeccables et un savoir-faire
            transmis de génération en génération.
          </p>
          <Link
            href="/catalog"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-brand-50"
          >
            Découvrir le catalogue
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductGrid
          items={products}
          subtitle="Collection complète"
          title="Tous nos produits"
        />

        <ReviewsSection
          reviews={allReviews}
          rating={avgRating}
          reviewCount={totalReviews}
        />
      </div>
    </>
  );
}
