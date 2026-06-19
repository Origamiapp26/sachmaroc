import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  updateCategory,
  deleteCategory,
  getCategoryById,
  type CategoryInput,
} from "@/lib/services/categories";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await initDb();
  const { id } = await context.params;
  const category = await getCategoryById(id);
  if (!category) {
    return NextResponse.json({ error: "الفئة ما لقيناهاش" }, { status: 404 });
  }
  return NextResponse.json(category);
}

export async function PUT(request: Request, context: RouteContext) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as Partial<CategoryInput>;
  const category = await updateCategory(id, body);
  if (!category) {
    return NextResponse.json({ error: "الفئة ما لقيناهاش" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, context: RouteContext) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteCategory(id);
  if (!deleted) {
    return NextResponse.json({ error: "الفئة ما لقيناهاش" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json({ success: true });
}
