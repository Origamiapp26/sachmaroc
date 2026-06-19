import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getProducts, ProductValidationError, renameCategory } from "@/lib/products";
import { revalidateStorefront } from "@/lib/revalidate-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const products = getProducts().filter((p) => p.category === id);

  if (products.length === 0) {
    return NextResponse.json({ error: "الفئة ما لقيناهاش" }, { status: 404 });
  }

  return NextResponse.json({
    id,
    name: id,
    productCount: products.length,
  });
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as { name?: string };
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "اسم الفئة الجديد مطلوب" }, { status: 400 });
    }

    const count = renameCategory(id, body.name);
    if (count === 0) {
      return NextResponse.json({ error: "الفئة ما لقيناهاش" }, { status: 404 });
    }

    revalidateStorefront();
    return NextResponse.json({ name: body.name.trim(), productCount: count });
  } catch (err) {
    if (err instanceof ProductValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "وقع خطأ فالتحديث" }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json(
    { error: "احذف المنتجات أو بدّل فئتها من صفحة المنتجات" },
    { status: 405 }
  );
}
