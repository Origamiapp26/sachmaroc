import { readFileSync, writeFileSync, renameSync } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import type { StoreSettings } from "@/types/settings";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "SachMaroc",
  logo: "",
  whatsappNumber: "212607674922",
  contact: { email: "", phone: "", address: "" },
  social: { facebook: "", instagram: "", tiktok: "" },
  hero: {
    badge: "منتجات مغربية أصلية",
    title: "مرحبا بكم فـ",
    titleHighlight: "SachMaroc",
    subtitle: "لقا أفضل المنتجات بأثمنة مناسبة",
    image: "",
    ctaPrimary: "شوف المنتجات",
    ctaSecondary: "الأكثر مبيعاً",
  },
  delivery: { title: "", description: "", items: [] },
  cities: [],
  testimonials: [],
  banners: [],
  seo: {
    defaultTitle: "SachMaroc",
    defaultDescription: "متجر مغربي أونلاين",
  },
};

function readSettingsFile(): StoreSettings {
  noStore();
  try {
    const raw = readFileSync(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
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
  const updated = { ...current, ...partial };
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
