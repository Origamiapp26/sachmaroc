import type { Product, LandingBenefit, LandingFAQItem } from "@/types/product";
import type { StoreSettings, Testimonial } from "@/types/settings";
import { getProductSlug } from "@/lib/product-urls";

export const DEFAULT_LANDING_BENEFITS: LandingBenefit[] = [
  { icon: "💵", title: "الدفع عند الاستلام", text: "خلّص كاش ملي توصلك الطلبية — بلا مخاطرة" },
  { icon: "🚚", title: "توصيل لجميع المدن", text: "كنوصلو لكازا، الرباط، مراكش وجميع المدن المغربية" },
  { icon: "⭐", title: "منتجات أصلية", text: "مختارة بعناية وجودة مضمونة 100%" },
  { icon: "📱", title: "تأكيد سريع", text: "غادي نتاصلو بيك فالتليفون باش نأكدو الطلب" },
  { icon: "🔄", title: "إرجاع سهل", text: "إلا ما عجبكش المنتج، تواصل معنا خلال 7 أيام" },
  { icon: "🎁", title: "تغليف أنيق", text: "تغليف محترف — مثالي للهدايا" },
];

export const DEFAULT_LANDING_FAQ: LandingFAQItem[] = [
  {
    question: "كيفاش نطلب؟",
    answer: "عمر الفورم فوق بالاسم والهاتف والمدينة والعنوان واضغط «اطلب الآن». غادي نتاصلو بيك باش نأكدو الطلبية.",
  },
  {
    question: "شنو هي طريقة الدفع؟",
    answer: "الدفع عند الاستلام (COD) فقط. تخلص كاش ملي يوصلك الطلب عند الباب.",
  },
  {
    question: "شحال كتاخد التوصيل؟",
    answer: "من 24 ل 72 ساعة حسب المدينة. المدن الكبرى عادة فـ 48 ساعة.",
  },
  {
    question: "واش التوصيل مجاني؟",
    answer: "أجور التوصيل كتبان فالفورم حسب المدينة ديالك. كاين عروض توصيل مجاني فبعض المدن.",
  },
  {
    question: "واش نقدر نرجع المنتج؟",
    answer: "إلا كان المنتج فيه مشكل أو ما مطابقش للوصف، تواصل معنا خلال 7 أيام وغادي نلقاو حل.",
  },
];

export interface ResolvedLandingContent {
  headline: string;
  subheadline: string;
  benefits: LandingBenefit[];
  faq: LandingFAQItem[];
  reviews: Testimonial[];
  landingUrl: string;
}

export function resolveLandingContent(
  product: Product,
  settings: StoreSettings,
  baseUrl: string
): ResolvedLandingContent {
  const landing = product.landing;
  const slug = getProductSlug(product);

  const benefits =
    landing?.benefits && landing.benefits.length >= 3
      ? landing.benefits.slice(0, 6)
      : settings.trustBar.length >= 3
        ? settings.trustBar.slice(0, 6).map((t) => ({
            icon: t.icon,
            title: t.text,
            text: "ميزة حصرية لزبناء SachMaroc",
          }))
        : DEFAULT_LANDING_BENEFITS;

  const faq =
    landing?.faq && landing.faq.length > 0 ? landing.faq : DEFAULT_LANDING_FAQ;

  const reviews = settings.testimonials.slice(0, 4);

  return {
    headline: landing?.headline || product.name,
    subheadline:
      landing?.subheadline ||
      (product.description.length > 120
        ? `${product.description.slice(0, 120)}…`
        : product.description),
    benefits,
    faq,
    reviews,
    landingUrl: `${baseUrl}/landing/${slug}`,
  };
}
