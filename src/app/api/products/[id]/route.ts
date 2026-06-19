import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "@/lib/services/products";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await initDb();
  const { id } = await context.params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "المنتج ما لقيناهش" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, context: RouteContext) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Partial<ProductInput>;
  const product = await updateProduct(id, body);
  if (!product) {
    return NextResponse.json({ error: "المنتج ما لقيناهش" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, context: RouteContext) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "المنتج ما لقيناهش" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json({ success: true });
}
