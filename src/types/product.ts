export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export type ProductBadge = "جديد" | "الأكثر مبيعاً" | "إصدار محدود";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  category: string;
  image: string;
  images: string[];
  badge?: ProductBadge;
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  featured: boolean;
  reviews: Review[];
  features: string[];
  inStock: boolean;
}

export type OrderStatus =
  | "pending"
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
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface ProductFilters {
  q?: string;
  category?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sort?: "price_asc" | "price_desc" | "rating" | "newest" | "name";
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  totalCategories: number;
}
