import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getCategories,
  createCategory,
  type CategoryInput,
} from "@/lib/services/categories";
import { initDb } from "@/lib/init-db";

export const runtime = "nodejs";

export async function GET() {
  await initDb();
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  await initDb();
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = (await request.json()) as CategoryInput;
  const category = await createCategory(body);
  revalidatePath("/");
  revalidatePath("/products");
  return NextResponse.json(category, { status: 201 });
}
