import {
  eq,
  and,
  or,
  like,
  gte,
  lte,
  desc,
  asc,
  sql,
  count,
} from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import {
  products,
  categories,
  productImages,
  productFeatures,
  reviews,
} from "@/db/schema";
import type { Product, ProductFilters, ProductBadge } from "@/types/product";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function hydrateProduct(
  row: typeof products.$inferSelect
): Promise<Product> {
  const [category, images, features, productReviews] = await Promise.all([
    db.query.categories.findFirst({ where: eq(categories.id, row.categoryId) }),
    db.query.productImages.findMany({
      where: eq(productImages.productId, row.id),
      orderBy: asc(productImages.sortOrder),
    }),
    db.query.productFeatures.findMany({
      where: eq(productFeatures.productId, row.id),
      orderBy: asc(productFeatures.sortOrder),
    }),
    db.query.reviews.findMany({
      where: eq(reviews.productId, row.id),
      orderBy: desc(reviews.date),
    }),
  ]);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    categoryId: row.categoryId,
    category: category?.name ?? "",
    image: row.image,
    images: images.length > 0 ? images.map((i) => i.url) : [row.image],
    badge: (row.badge as ProductBadge) ?? undefined,
    rating: row.rating,
    reviewCount: row.reviewCount,
    stockQuantity: row.stockQuantity,
    featured: row.featured,
    inStock: row.inStock && row.stockQuantity > 0,
    features: features.map((f) => f.text),
    reviews: productReviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      comment: r.comment,
      date: r.date,
      verified: r.verified,
    })),
  };
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<Product[]> {
  const conditions = [];

  if (filters.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  } else if (filters.category && filters.category !== "الكل") {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.name, filters.category),
    });
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }

  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(
        like(products.name, term),
        like(products.description, term),
        like(products.tagline, term)
      )!
    );
  }

  if (filters.minPrice !== undefined) {
    conditions.push(gte(products.price, filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(products.price, filters.maxPrice));
  }
  if (filters.inStock) {
    conditions.push(and(eq(products.inStock, true), gte(products.stockQuantity, 1))!);
  }
  if (filters.featured) {
    conditions.push(eq(products.featured, true));
  }

  let orderBy;
  switch (filters.sort) {
    case "price_asc":
      orderBy = asc(products.price);
      break;
    case "price_desc":
      orderBy = desc(products.price);
      break;
    case "rating":
      orderBy = desc(products.rating);
      break;
    case "name":
      orderBy = asc(products.name);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  const rows = await db.query.products.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy,
  });

  return Promise.all(rows.map(hydrateProduct));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
  return row ? hydrateProduct(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  return row ? hydrateProduct(row) : null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: eq(products.featured, true),
    orderBy: desc(products.createdAt),
    limit,
  });
  return Promise.all(rows.map(hydrateProduct));
}

export interface ProductInput {
  name: string;
  slug?: string;
  tagline?: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  image: string;
  images?: string[];
  badge?: string;
  stockQuantity: number;
  featured?: boolean;
  inStock?: boolean;
  features?: string[];
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const id = nanoid();
  const now = new Date().toISOString();
  const slug = input.slug || slugify(input.name);

  await db.insert(products).values({
    id,
    slug,
    name: input.name,
    tagline: input.tagline ?? "",
    description: input.description,
    price: input.price,
    originalPrice: input.originalPrice,
    categoryId: input.categoryId,
    image: input.image,
    badge: input.badge,
    stockQuantity: input.stockQuantity,
    featured: input.featured ?? false,
    inStock: input.inStock ?? input.stockQuantity > 0,
    createdAt: now,
    updatedAt: now,
  });

  const imgs = input.images?.length ? input.images : [input.image];
  for (let i = 0; i < imgs.length; i++) {
    await db.insert(productImages).values({
      id: nanoid(),
      productId: id,
      url: imgs[i],
      sortOrder: i,
    });
  }

  for (let i = 0; i < (input.features?.length ?? 0); i++) {
    await db.insert(productFeatures).values({
      id: nanoid(),
      productId: id,
      text: input.features![i],
      sortOrder: i,
    });
  }

  return (await getProductById(id))!;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product | null> {
  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  if (!existing) return null;

  const now = new Date().toISOString();
  await db
    .update(products)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.slug && { slug: input.slug }),
      ...(input.tagline !== undefined && { tagline: input.tagline }),
      ...(input.description && { description: input.description }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.originalPrice !== undefined && {
        originalPrice: input.originalPrice,
      }),
      ...(input.categoryId && { categoryId: input.categoryId }),
      ...(input.image && { image: input.image }),
      ...(input.badge !== undefined && { badge: input.badge }),
      ...(input.stockQuantity !== undefined && {
        stockQuantity: input.stockQuantity,
      }),
      ...(input.featured !== undefined && { featured: input.featured }),
      ...(input.inStock !== undefined && { inStock: input.inStock }),
      updatedAt: now,
    })
    .where(eq(products.id, id));

  if (input.images) {
    await db.delete(productImages).where(eq(productImages.productId, id));
    for (let i = 0; i < input.images.length; i++) {
      await db.insert(productImages).values({
        id: nanoid(),
        productId: id,
        url: input.images[i],
        sortOrder: i,
      });
    }
  }

  if (input.features) {
    await db.delete(productFeatures).where(eq(productFeatures.productId, id));
    for (let i = 0; i < input.features.length; i++) {
      await db.insert(productFeatures).values({
        id: nanoid(),
        productId: id,
        text: input.features[i],
        sortOrder: i,
      });
    }
  }

  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await db.delete(products).where(eq(products.id, id));
  return result.changes > 0;
}

export async function decrementStock(
  productId: string,
  quantity: number
): Promise<void> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
  if (!product) return;
  const newQty = Math.max(0, product.stockQuantity - quantity);
  await db
    .update(products)
    .set({
      stockQuantity: newQty,
      inStock: newQty > 0,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(products.id, productId));
}

export { slugify };
