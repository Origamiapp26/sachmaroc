import { getProducts } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { initDb } from "@/lib/init-db";
import ProductsPageClient from "./ProductsPageClient";

export const metadata = {
  title: "المنتجات",
  description: "تصفح جميع منتجات SachMaroc المغربية الأصلية بأثمنة مناسبة",
};

export default async function ProductsPage() {
  await initDb();
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  return <ProductsPageClient initialProducts={products} categories={categories} />;
}
