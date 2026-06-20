import { readFileSync, writeFileSync, renameSync } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import type { StoreSettings } from "@/types/settings";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

const DEFAULT_HOMEPAGE: StoreSettings["homepage"] = {
  bestSellers: { enabled: true, subtitle: "الأكثر طلباً", title: "الأكثر مبيعاً" },
  newArrivals: { enabled: true, subtitle: "جديد", title: "وافدات جديدة" },
  reviews: { enabled: true, subtitle: "آراء الزبناء", title: "شنو كيقولو علينا" },
  categories: { enabled: true, subtitle: "الفئات", title: "تصفح حسب الفئة" },
  featured: { enabled: true, subtitle: "مختارات", title: "منتجات مميزة" },
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "SachMaroc",
  logo: "",
  whatsappNumber: "212607674922",
  googleSheetsWebhookUrl: "",
  facebookPixelId: "",
  googleAnalyticsId: "",
  contact: { email: "", phone: "", address: "" },
  social: { facebook: "", instagram: "", tiktok: "" },
  heroSlides: [],
  trustBar: [
    { icon: "🚚", text: "توصيل لجميع المدن" },
    { icon: "💰", text: "الدفع عند الاستلام" },
    { icon: "⭐", text: "منتجات مختارة بعناية" },
    { icon: "📱", text: "طلب عبر واتساب" },
  ],
  homepage: DEFAULT_HOMEPAGE,
  delivery: { title: "", description: "", items: [] },
  cities: [],
  testimonials: [],
  banners: [],
  seo: {
    defaultTitle: "SachMaroc",
    defaultDescription: "متجر مغربي أونلاين",
  },
};

function mergeSettings(parsed: Partial<StoreSettings>): StoreSettings {
  const envWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() || "";

  return {
    ...DEFAULT_SETTINGS,
    ...parsed,
    googleSheetsWebhookUrl:
      envWebhook || parsed.googleSheetsWebhookUrl || DEFAULT_SETTINGS.googleSheetsWebhookUrl,
    homepage: { ...DEFAULT_HOMEPAGE, ...parsed.homepage },
    contact: { ...DEFAULT_SETTINGS.contact, ...parsed.contact },
    social: { ...DEFAULT_SETTINGS.social, ...parsed.social },
    seo: { ...DEFAULT_SETTINGS.seo, ...parsed.seo },
    heroSlides: parsed.heroSlides ?? DEFAULT_SETTINGS.heroSlides,
    trustBar: parsed.trustBar ?? DEFAULT_SETTINGS.trustBar,
    testimonials: parsed.testimonials ?? [],
    banners: parsed.banners ?? [],
    cities: parsed.cities ?? [],
    delivery: parsed.delivery ?? DEFAULT_SETTINGS.delivery,
  };
}

function readSettingsFile(): StoreSettings {
  noStore();
  try {
    const raw = readFileSync(SETTINGS_FILE, "utf-8");
    return mergeSettings(JSON.parse(raw) as Partial<StoreSettings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettingsFile(settings: StoreSettings): void {
  const content = `${JSON.stringify(settings, null, 2)}\n`;
  const tmp = `${SETTINGS_FILE}.tmp`;
  writeFileSync(tmp, content, "utf-8");
  renameSync(tmp, SETTINGS_FILE);
}

export function getSettings(): StoreSettings {
  return readSettingsFile();
}

export function updateSettings(partial: Partial<StoreSettings>): StoreSettings {
  const current = readSettingsFile();
  const updated = mergeSettings({ ...current, ...partial });
  writeSettingsFile(updated);
  return updated;
}

export function getShippingCost(cityName: string): number {
  const city = getSettings().cities.find((c) => c.name === cityName);
  return city?.shippingCost ?? 35;
}

export function getActiveBanners() {
  return getSettings().banners.filter((b) => b.active);
}
