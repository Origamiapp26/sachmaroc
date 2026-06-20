import type { HeroSlide } from "@/types/settings";
import type { Product } from "@/types/product";
import { getProductById } from "@/lib/products";

export interface ResolvedHeroSlide {
  productId: string;
  title: string;
  shortDescription: string;
  image: string;
  price: number;
  oldPrice?: number;
  ctaOrder: string;
  ctaDetails: string;
}

/** يحلّل شرائح الهيرو من settings + products.json */
export function resolveHeroSlides(slides: HeroSlide[]): ResolvedHeroSlide[] {
  const resolved: ResolvedHeroSlide[] = [];

  for (const slide of slides.slice(0, 5)) {
    const product = getProductById(slide.productId);
    if (!product) continue;

    const short =
      slide.shortDescription ||
      (product.description.length > 140
        ? `${product.description.slice(0, 140)}…`
        : product.description);

    resolved.push({
      productId: product.id,
      title: slide.title || product.name,
      shortDescription: short,
      image: slide.image || product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      ctaOrder: slide.ctaOrder || "اطلب الآن",
      ctaDetails: slide.ctaDetails || "شاهد التفاصيل",
    });
  }

  return resolved;
}

/** شرائح افتراضية من المنتجات المميزة */
export function getDefaultHeroSlides(products: Product[]): HeroSlide[] {
  return products
    .filter((p) => p.featured)
    .slice(0, 5)
    .map((p) => ({ productId: p.id }));
}
