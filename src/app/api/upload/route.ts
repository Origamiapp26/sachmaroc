import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "ما كاين حتى ملف" }, { status: 400 });
    }

    const url = await saveUploadedFile(file);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "وقع خطأ فالرفع";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
