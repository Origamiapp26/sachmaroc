import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getProductsUncached, importProducts } from "@/lib/products";
import { revalidateStorefront } from "@/lib/revalidate-store";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const products = getProductsUncached();
  return new NextResponse(JSON.stringify(products, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="products.json"',
    },
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Product[];
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "الملف غير صالح" }, { status: 400 });
    }
    importProducts(body);
    revalidateStorefront();
    return NextResponse.json({ count: body.length });
  } catch {
    return NextResponse.json({ error: "وقع خطأ فالاستيراد" }, { status: 400 });
  }
}
