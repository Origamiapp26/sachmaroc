import { getProducts, getCategories } from "@/lib/products";
import ProductsPageClient from "./ProductsPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "المنتجات",
  description: "تصفح جميع منتجات SachMaroc المغربية الأصلية بأثمنة مناسبة",
};

export default function ProductsPage() {
  const products = getProducts();
  const categories = getCategories();
  return <ProductsPageClient products={products} categories={categories} />;
}
