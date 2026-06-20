/**
 * ============================================================
 *  SachMaroc — Products Data Layer
 * ============================================================
 *
 *  📁 عدّل المنتجات من:  data/products.json
 *
 *  فيه تقدر تبدل:
 *    - name          → اسم المنتج
 *    - description   → الوصف
 *    - price         → الثمن (MAD)
 *    - oldPrice      → الثمن القديم (اختياري)
 *    - category      → الفئة
 *    - image         → الصورة الرئيسية
 *    - gallery       → صور إضافية
 *    - featured      → true/false للصفحة الرئيسية
 *    - inStock       → true/false للتوفر
 *    - whatsappNumber → رقم واتساب للطلب
 *
 *  ملي تبدل products.json، الصفحات كتحدّث تلقائياً.
 * ============================================================
 */

import { readFileSync, writeFileSync, renameSync } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { slugify, isValidSlug } from "@/lib/slug";
import { getProductSlug, getLandingUrl } from "@/lib/product-urls";
import type { Product, ProductFilters, ProductInput } from "@/types/product";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");

let productsCache: Product[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000;

function invalidateProductsCache() {
  productsCache = null;
  cacheTimestamp = 0;
}

export class ProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductValidationError";
  }
}

/** يقرا products.json من القرص — مع cache قصير للأداء */
function readProductsFile(): Product[] {
  const now = Date.now();
  if (productsCache && now - cacheTimestamp < CACHE_TTL_MS) {
    return productsCache;
  }
  noStore();
  const raw = readFileSync(PRODUCTS_FILE, "utf-8");
  productsCache = JSON.parse(raw) as Product[];
  cacheTimestamp = now;
  return productsCache;
}

/** جميع المنتجات */
export function getProducts(): Product[] {
  return readProductsFile();
}

/** قراءة مباشرة بدون cache (للكتابة) */
export function getProductsUncached(): Product[] {
  invalidateProductsCache();
  return readProductsFile();
}

/** منتج واحد بالمعرّف */
export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

/** منتج واحد بالـ slug */
export function getProductBySlug(slug: string): Product | undefined {
  const normalized = slug.trim().toLowerCase();
  return getProducts().find((p) => getProductSlug(p) === normalized);
}

/** جميع slugs للصفحات */
export function getAllLandingSlugs(): string[] {
  return getProducts().map(getProductSlug);
}

export { getProductSlug, getLandingUrl } from "@/lib/product-urls";

/** الأكثر مبيعاً */
export function getBestSellerProducts(): Product[] {
  const products = getProducts().filter((p) => p.isBestSeller);
  return products.length > 0 ? products : getProducts().filter((p) => p.featured).slice(0, 6);
}

/** الوافدات الجديدة */
export function getNewArrivalProducts(): Product[] {
  const products = getProducts().filter((p) => p.isNewArrival);
  if (products.length > 0) {
    return [...products].sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    );
  }
  return [...getProducts()]
    .sort((a, b) => (b.createdAt || b.id).localeCompare(a.createdAt || a.id))
    .slice(0, 6);
}

/** منتجات مشابهة */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

/** المنتجات المميزة للصفحة الرئيسية */
export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured);
}

/** جميع الفئات الفريدة */
export function getCategories(): string[] {
  const cats = new Set(getProducts().map((p) => p.category));
  return ["الكل", ...Array.from(cats)];
}

/** بحث وفلترة */
export function filterProducts(filters: ProductFilters = {}): Product[] {
  let result = getProducts();

  if (filters.category && filters.category !== "الكل") {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters.inStock) {
    result = result.filter((p) => p.inStock);
  }

  if (filters.featured) {
    result = result.filter((p) => p.featured);
  }

  switch (filters.sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      break;
    default:
      break;
  }

  return result;
}

/** رابط صفحة المنتج */
export function getProductUrl(id: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";
  return `${base}/products/${id}`;
}

/** يكتب products.json بشكل آمن (ملف مؤقت ثم استبدال) */
function writeProductsFile(products: Product[]): void {
  const content = `${JSON.stringify(products, null, 2)}\n`;
  const tmp = `${PRODUCTS_FILE}.tmp`;
  writeFileSync(tmp, content, "utf-8");
  renameSync(tmp, PRODUCTS_FILE);
  invalidateProductsCache();
}

/** التحقق من بيانات المنتج */
export function validateProductInput(
  data: Partial<ProductInput>,
  options: { partial?: boolean } = {}
): ProductInput {
  const { partial = false } = options;
  const errors: string[] = [];

  const requireField = (field: keyof ProductInput, label: string) => {
    const value = data[field];
    if (partial && value === undefined) return;
    if (value === undefined || value === null || value === "") {
      errors.push(`${label} مطلوب`);
    }
  };

  requireField("name", "الاسم");
  requireField("description", "الوصف");
  requireField("category", "الفئة");
  requireField("image", "الصورة الرئيسية");

  if (!partial || data.price !== undefined) {
    if (typeof data.price !== "number" || data.price < 0) {
      errors.push("الثمن غير صالح");
    }
  }

  if (data.oldPrice !== undefined && data.oldPrice !== null) {
    if (typeof data.oldPrice !== "number" || data.oldPrice < 0) {
      errors.push("الثمن القديم غير صالح");
    }
  }

  if (
    data.featured !== undefined &&
    data.featured !== null &&
    typeof data.featured !== "boolean"
  ) {
    errors.push("حقل مميز غير صالح");
  }

  if (
    data.inStock !== undefined &&
    data.inStock !== null &&
    typeof data.inStock !== "boolean"
  ) {
    errors.push("حقل التوفر غير صالح");
  }

  if (errors.length > 0) {
    throw new ProductValidationError(errors.join("، "));
  }

  let slug: string | undefined;
  if (data.slug !== undefined && data.slug !== null && String(data.slug).trim()) {
    const s = String(data.slug).trim().toLowerCase();
    if (!isValidSlug(s)) {
      throw new ProductValidationError("الرابط (slug) غير صالح — استعمل حروف إنجليزية وأرقام وشرطات");
    }
    slug = s;
  }

  return {
    name: String(data.name).trim(),
    description: String(data.description).trim(),
    price: Number(data.price),
    oldPrice:
      data.oldPrice === undefined || data.oldPrice === null
        ? undefined
        : Number(data.oldPrice),
    category: String(data.category).trim(),
    image: String(data.image).trim(),
    gallery: Array.isArray(data.gallery)
      ? data.gallery.filter((url) => typeof url === "string" && url.trim())
      : [],
    featured: typeof data.featured === "boolean" ? data.featured : false,
    inStock: typeof data.inStock === "boolean" ? data.inStock : true,
    whatsappNumber: String(data.whatsappNumber || WHATSAPP_NUMBER).trim(),
    isBestSeller: Boolean(data.isBestSeller),
    isNewArrival: Boolean(data.isNewArrival),
    slug,
    landing: data.landing,
  };
}

/** معرّف تلقائي للمنتج الجديد */
export function generateNextProductId(): string {
  const products = getProductsUncached();
  const maxNum = products.reduce((max, product) => {
    const num = parseInt(product.id, 10);
    return !Number.isNaN(num) && num > max ? num : max;
  }, 0);
  return String(maxNum + 1);
}

/** إضافة منتج جديد → يحدّث products.json */
export function createProduct(input: ProductInput): Product {
  const data = validateProductInput(input);
  const products = getProductsUncached();
  const id = generateNextProductId();

  if (products.some((p) => p.id === id)) {
    throw new ProductValidationError("معرّف المنتج موجود مسبقاً");
  }

  const product: Product = {
    id,
    ...data,
    gallery: data.gallery ?? [],
    slug: data.slug || slugify(data.name) || `product-${id}`,
    createdAt: new Date().toISOString(),
  };
  writeProductsFile([...products, product]);
  return product;
}

/** تعديل منتج → يحدّث products.json */
export function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Product {
  const products = getProductsUncached();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new ProductValidationError("المنتج ما لقيناهش");
  }

  const merged = { ...products[index], ...input };
  const data = validateProductInput(merged);
  const product: Product = {
    id,
    ...data,
    gallery: data.gallery ?? [],
    slug: data.slug || products[index].slug || slugify(data.name) || `product-${id}`,
    landing: data.landing ?? products[index].landing,
  };
  const updated = [...products];
  updated[index] = product;
  writeProductsFile(updated);
  return product;
}

/** حذف منتج → يحدّث products.json */
export function deleteProduct(id: string): boolean {
  const products = getProductsUncached();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeProductsFile(filtered);
  return true;
}

/** إحصائيات الفئات */
export function getCategoryStats(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const product of getProducts()) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "ar"));
}

/** استيراد منتجات بالجملة */
export function importProducts(products: Product[]): void {
  writeProductsFile(products);
}
export function renameCategory(oldName: string, newName: string): number {
  const trimmed = newName.trim();
  if (!trimmed) throw new ProductValidationError("اسم الفئة مطلوب");
  if (oldName === trimmed) return 0;

  const products = getProductsUncached();
  let count = 0;
  const updated = products.map((product) => {
    if (product.category !== oldName) return product;
    count += 1;
    return { ...product, category: trimmed };
  });

  if (count === 0) return 0;
  writeProductsFile(updated);
  return count;
}
