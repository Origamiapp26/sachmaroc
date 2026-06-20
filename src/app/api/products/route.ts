import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createProduct,
  getProducts,
  ProductValidationError,
} from "@/lib/products";
import { revalidateStorefront } from "@/lib/revalidate-store";
import type { ProductInput } from "@/types/product";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProductInput;
    const product = createProduct(body);
    revalidateStorefront();
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof ProductValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "وقع خطأ فالحفظ" }, { status: 500 });
  }
}
