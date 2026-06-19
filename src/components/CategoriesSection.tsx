import Link from "next/link";
import { getProducts, getCategories } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export default function CategoriesSection() {
  const products = getProducts();
  const categories = getCategories().filter((c) => c !== "الكل");

  const categoryImages: Record<string, string> = {};
  for (const p of products) {
    if (!categoryImages[p.category]) categoryImages[p.category] = p.image;
  }

  return (
    <section className="bg-neutral-50/50 py-16 dark:bg-neutral-900/50 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">الفئات</p>
          <h2 className="text-3xl font-bold tracking-tight text-ink dark:text-white">تصفح حسب الفئة</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-card-hover dark:bg-neutral-900"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                {categoryImages[category] && (
                  <ProductImage
                    src={categoryImages[category]}
                    alt={category}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-5">
                <h3 className="text-lg font-bold text-white">{category}</h3>
                <p className="mt-1 text-sm text-white/80">
                  {products.filter((p) => p.category === category).length} منتج
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
