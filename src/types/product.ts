/**
 * ============================================================
 *  SachMaroc — Product Type
 * ============================================================
 *  كل المنتجات كتجيو من: data/products.json
 *  ما تحتاجش تبدل هاد الملف — عدّل products.json فقط.
 * ============================================================
 */

export interface Product {
  /** معرّف فريد — كيخدم فالرابط: /products/[id] */
  id: string;
  /** اسم المنتج بالدارجة */
  name: string;
  /** وصف كامل للمنتج */
  description: string;
  /** الثمن بالدرهم (MAD) */
  price: number;
  /** الثمن القديم (اختياري) — كيبان مشطوب */
  oldPrice?: number;
  /** الفئة: تقليدي، عطور، مطبخ، ديكور، عناية... */
  category: string;
  /** الصورة الرئيسية (رابط أو مسار /uploads/...) */
  image: string;
  /** صور إضافية للمعرض */
  gallery: string[];
  /** true = يبان فالصفحة الرئيسية */
  featured: boolean;
  /** true = متوفر، false = نفد المخزون */
  inStock: boolean;
  /** رقم واتساب بدون + (مثال: 212607674922) */
  whatsappNumber: string;
  /** true = يبان فقسم الأكثر مبيعاً */
  isBestSeller?: boolean;
  /** true = يبان فقسم الوافدات الجديدة */
  isNewArrival?: boolean;
  /** تاريخ الإضافة (ISO) */
  createdAt?: string;
  /** رابط صفحة الهبوط: /landing/[slug] */
  slug?: string;
  /** محتوى مخصص لصفحة الهبوط */
  landing?: ProductLanding;
}

export interface LandingBenefit {
  icon: string;
  title: string;
  text: string;
}

export interface LandingFAQItem {
  question: string;
  answer: string;
}

export interface ProductLanding {
  headline?: string;
  subheadline?: string;
  benefits?: LandingBenefit[];
  faq?: LandingFAQItem[];
}

/** بيانات إنشاء/تعديل منتج من لوحة الإدارة */
export type ProductInput = Omit<Product, "id" | "gallery"> & {
  gallery?: string[];
  slug?: string;
  landing?: ProductLanding;
};

export interface ProductFilters {
  q?: string;
  category?: string;
  inStock?: boolean;
  featured?: boolean;
  sort?: "price_asc" | "price_desc" | "name" | "newest";
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  totalCategories: number;
}
