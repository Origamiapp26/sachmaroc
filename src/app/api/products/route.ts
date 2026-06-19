import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { initDb } from "@/lib/init-db";
import {
  getProducts,
  createProduct,
  type ProductInput,
} from "@/lib/services/products";
import type { ProductFilters } from "@/types/product";

export const runtime = "nodejs";

export async function GET(request: Request) {
  await initDb();
  const { searchParams } = new URL(request.url);

  const filters: ProductFilters = {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    inStock: searchParams.get("inStock") === "true" || undefined,
    featured: searchParams.get("featured") === "true" || undefined,
    sort: (searchParams.get("sort") as ProductFilters["sort"]) || undefined,
  };

  const products = await getProducts(filters);
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = (await request.json()) as ProductInput;
  const product = await createProduct(body);
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(product, { status: 201 });
}
