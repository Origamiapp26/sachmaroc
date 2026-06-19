import Link from "next/link";
import { getCategories } from "@/lib/services/categories";
import { initDb } from "@/lib/init-db";

export default async function CategoriesSection() {
  await initDb();
  const categories = await getCategories();

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
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-card-hover dark:bg-neutral-900"
            >
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">🏷️</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-5">
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 text-sm text-white/80">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
