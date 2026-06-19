import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteProduct,
  getProductById,
  ProductValidationError,
  updateProduct,
} from "@/lib/products";
import { revalidateStorefront } from "@/lib/revalidate-store";
import type { ProductInput } from "@/types/product";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "المنتج ما لقيناهش" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as Partial<ProductInput>;
    const product = updateProduct(id, body);
    revalidateStorefront();
    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof ProductValidationError) {
      const status = err.message.includes("ما لقيناهش") ? 404 : 400;
      return NextResponse.json({ error: err.message }, { status });
    }
    return NextResponse.json({ error: "وقع خطأ فالتحديث" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "المنتج ما لقيناهش" }, { status: 404 });
  }

  revalidateStorefront();
  return NextResponse.json({ success: true });
}
