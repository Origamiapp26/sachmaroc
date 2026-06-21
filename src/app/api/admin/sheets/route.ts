import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getGoogleSheetsConfig,
  syncTestOrderToSheet,
} from "@/lib/google-sheets";

export const runtime = "nodejs";

/** GET — Google Sheets API config status (admin) */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const config = getGoogleSheetsConfig();
  return NextResponse.json({
    configured: config.configured,
    sheetId: config.sheetId,
    clientEmail: config.clientEmail,
  });
}

/** POST — append a test order row via Google Sheets API (admin) */
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const result = await syncTestOrderToSheet();
  return NextResponse.json({
    ok: result.ok,
    rowsWritten: result.rowsWritten,
    error: result.error,
    durationMs: result.durationMs,
    sheetId: result.sheetId,
  });
}
