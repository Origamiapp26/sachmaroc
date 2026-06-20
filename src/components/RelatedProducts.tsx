import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types/product";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-20 border-t border-neutral-100 pt-16 dark:border-neutral-800">
      <ProductGrid items={products} title="منتجات مشابهة" subtitle="قد يعجبوك" />
    </div>
  );
}
