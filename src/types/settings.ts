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
  contact: ContactInfo;
  social: SocialLinks;
  hero: HeroSettings;
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
