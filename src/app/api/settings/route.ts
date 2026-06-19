import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/settings";
import { isAdminAuthenticated } from "@/lib/auth";
import { revalidateSettings } from "@/lib/revalidate-store";
import type { StoreSettings } from "@/types/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<StoreSettings>;
  const settings = updateSettings(body);
  revalidateSettings();
  return NextResponse.json(settings);
}
