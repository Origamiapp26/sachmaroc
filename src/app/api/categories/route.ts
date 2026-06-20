import { NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

/** الفئات كتجي تلقائياً من حقل category فـ data/products.json */
export async function GET() {
  const names = getCategories().filter((c) => c !== "الكل");
  const products = getProducts();

  const categories = names.map((name) => ({
    id: name,
    name,
    productCount: products.filter((p) => p.category === name).length,
  }));

  return NextResponse.json(categories);
}

export async function POST() {
  return NextResponse.json(
    { error: "عدّل الفئات من حقل category فـ data/products.json" },
    { status: 405 }
  );
}
