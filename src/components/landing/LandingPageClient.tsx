"use client";

import { useEffect, useMemo } from "react";
import type { Product } from "@/types/product";
import type { ResolvedLandingContent } from "@/lib/landing";
import { formatPrice } from "@/lib/utils";
import { trackViewContent } from "@/lib/tracking";
import ProductOrderForm from "@/components/ProductOrderForm";
import CashOnDeliveryBadge from "@/components/CashOnDeliveryBadge";
import DeliveryBadge from "@/components/DeliveryBadge";
import LandingHeroGallery from "@/components/landing/LandingHeroGallery";
import LandingBenefits from "@/components/landing/LandingBenefits";
import LandingReviews from "@/components/landing/LandingReviews";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingDeliveryPayment from "@/components/landing/LandingDeliveryPayment";
import LandingStickyCTA from "@/components/landing/LandingStickyCTA";

const HERO_FORM_ID = "landing-order-hero";

export default function LandingPageClient({
  product,
  content,
  landingUrl,
}: {
  product: Product;
  content: ResolvedLandingContent;
  landingUrl: string;
}) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const images = useMemo(
    () => [product.image, ...product.gallery.filter((g) => g !== product.image)],
    [product.image, product.gallery]
  );

  const stickyTotal = useMemo(() => product.price + 35, [product.price]);

  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }, [product]);

  return (
    <>
      {/* Urgency strip — FB ads hook */}
      <div className="bg-ink px-3 py-2 text-center text-xs font-bold text-white dark:bg-whatsapp sm:text-sm">
        🔥 عرض محدود — الدفع عند الاستلام · توصيل لجميع المدن
      </div>

      {/* 1. Hero — conversion above the fold */}
      <section className="relative overflow-hidden bg-gradient-to-b from-whatsapp-light/50 to-white dark:from-whatsapp/10 dark:to-neutral-950">
        <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-whatsapp/15 blur-3xl" />

        <div className="mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
          <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-8">
            <LandingHeroGallery images={images} name={product.name} discount={discount} />

            <div className="min-w-0">
              {content.reviews.length > 0 && (
                <p className="mb-2 text-center text-xs text-ink-muted lg:text-right">
                  ⭐ {content.reviews.length}+ زبون راضي · توصيل مضمون
                </p>
              )}

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-whatsapp sm:text-xs lg:text-right">
                عرض حصري — اطلب دابا
              </p>

              <h1 className="mt-1.5 text-center text-xl font-bold leading-tight text-ink dark:text-white sm:text-2xl lg:text-right lg:text-3xl xl:text-4xl">
                {content.headline}
              </h1>

              <p className="mt-2 text-center text-xs leading-relaxed text-ink-muted sm:text-sm lg:text-right">
                {content.subheadline}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="text-2xl font-bold text-whatsapp sm:text-3xl lg:text-4xl">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-base text-ink-faint line-through sm:text-lg">
                      {formatPrice(product.oldPrice)}
                    </span>
                    {discount && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950">
                        وفّر {discount}%
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                <CashOnDeliveryBadge compact />
                <DeliveryBadge />
              </div>

              <div className="mt-3" id={HERO_FORM_ID}>
                <ProductOrderForm
                  product={product}
                  productUrl={landingUrl}
                  compact
                  formId={HERO_FORM_ID}
                  showSticky={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Benefits */}
      <LandingBenefits benefits={content.benefits} />

      {/* 3. Reviews */}
      <LandingReviews reviews={content.reviews} />

      {/* 4. FAQ */}
      <LandingFAQ items={content.faq} />

      {/* 5. Delivery & payment */}
      <LandingDeliveryPayment />

      {/* 6. Bottom order form */}
      <section className="border-t border-whatsapp/20 bg-gradient-to-b from-whatsapp-light/30 to-white py-10 dark:from-whatsapp/10 dark:to-neutral-950 sm:py-14">
        <div className="mx-auto max-w-lg px-4">
          <div className="mb-5 text-center">
            <span className="inline-block rounded-full bg-whatsapp px-4 py-1 text-xs font-bold text-white">
              آخر خطوة
            </span>
            <h2 className="mt-3 text-2xl font-bold text-ink dark:text-white">اطلب دابا</h2>
            <p className="mt-1 text-sm text-ink-muted">
              عمر المعلومات واضغط اطلب الآن — غادي نتاصلو بيك للتأكيد
            </p>
          </div>
          <ProductOrderForm
            product={product}
            productUrl={landingUrl}
            compact
            formId="landing-order-bottom"
            showSticky={false}
          />
        </div>
      </section>

      {/* 7. Sticky mobile order button */}
      {product.inStock && (
        <>
          <LandingStickyCTA formId={HERO_FORM_ID} total={stickyTotal} />
          <div className="h-24 lg:hidden" aria-hidden />
        </>
      )}
    </>
  );
}
