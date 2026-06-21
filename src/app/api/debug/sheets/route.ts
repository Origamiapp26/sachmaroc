import { NextResponse } from "next/server";
import {
  getGoogleSheetsConfig,
  syncTestOrderToSheet,
} from "@/lib/google-sheets";

export const runtime = "nodejs";

/** Temporary — verify Google Sheets API from production */
export async function GET() {
  const config = getGoogleSheetsConfig();
  const result = await syncTestOrderToSheet();

  return NextResponse.json({
    success: result.ok,
    configured: config.configured,
    sheetId: config.sheetId,
    clientEmail: config.clientEmail,
    rowsWritten: result.rowsWritten,
    error: result.error,
    durationMs: result.durationMs,
  });
}
