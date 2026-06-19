import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { categories } from "@/db/schema";
import type { Category } from "@/types/product";

function mapCategory(row: typeof categories.$inferSelect): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    sortOrder: row.sortOrder,
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await db.query.categories.findMany({
    orderBy: asc(categories.sortOrder),
  });
  return rows.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
  return row ? mapCategory(row) : null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const row = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
  return row ? mapCategory(row) : null;
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const id = nanoid();
  const slug = input.slug || slugify(input.name);
  await db.insert(categories).values({
    id,
    slug,
    name: input.name,
    description: input.description ?? "",
    image: input.image ?? "",
    sortOrder: input.sortOrder ?? 0,
    createdAt: new Date().toISOString(),
  });
  return (await getCategoryById(id))!;
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<Category | null> {
  const existing = await getCategoryById(id);
  if (!existing) return null;

  await db
    .update(categories)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.slug && { slug: input.slug }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.image !== undefined && { image: input.image }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    })
    .where(eq(categories.id, id));

  return getCategoryById(id);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const result = await db.delete(categories).where(eq(categories.id, id));
  return result.changes > 0;
}
