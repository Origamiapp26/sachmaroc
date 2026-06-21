/** إعدادات المتجر — data/settings.json */

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface HeroSlide {
  /** معرّف المنتج من products.json */
  productId: string;
  /** عنوان مخصص (اختياري — يجي من المنتج) */
  title?: string;
  /** وصف قصير (اختياري) */
  shortDescription?: string;
  /** صورة مخصصة (اختياري) */
  image?: string;
  ctaOrder?: string;
  ctaDetails?: string;
}

export interface TrustBarItem {
  icon: string;
  text: string;
}

export interface HomepageSectionConfig {
  enabled: boolean;
  subtitle: string;
  title: string;
}

export interface HomepageSettings {
  bestSellers: HomepageSectionConfig;
  newArrivals: HomepageSectionConfig;
  reviews: HomepageSectionConfig;
  categories: HomepageSectionConfig;
  featured: HomepageSectionConfig;
}

/** @deprecated استخدم heroSlides */
export interface HeroSettings {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  image: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface DeliveryItem {
  icon: string;
  title: string;
  text: string;
}

export interface DeliverySettings {
  title: string;
  description: string;
  items: DeliveryItem[];
}

export interface CityShipping {
  name: string;
  shippingCost: number;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
}

export interface PromoBanner {
  id: string;
  text: string;
  link: string;
  active: boolean;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
}

export interface StoreSettings {
  storeName: string;
  logo: string;
  whatsappNumber: string;
  /** @deprecated — use GOOGLE_SHEET_ID env vars instead */
  googleSheetsWebhookUrl: string;
  facebookPixelId: string;
  googleAnalyticsId: string;
  contact: ContactInfo;
  social: SocialLinks;
  hero?: HeroSettings;
  heroSlides: HeroSlide[];
  trustBar: TrustBarItem[];
  homepage: HomepageSettings;
  delivery: DeliverySettings;
  cities: CityShipping[];
  testimonials: Testimonial[];
  banners: PromoBanner[];
  seo: SeoSettings;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  minOrder: number;
  expiresAt: string;
}
