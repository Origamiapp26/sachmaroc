import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { sendTestWebhook } from "@/lib/order-webhook";
import { getWebhookLog, recordWebhookDelivery } from "@/lib/webhook-log";

export const runtime = "nodejs";

/** GET — webhook config + recent delivery log (admin) */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { googleSheetsWebhookUrl } = getSettings();
  const envOverride = Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim());

  return NextResponse.json({
    configured: Boolean(googleSheetsWebhookUrl),
    url: googleSheetsWebhookUrl,
    source: envOverride ? "GOOGLE_SHEETS_WEBHOOK_URL env" : "data/settings.json",
    recentDeliveries: getWebhookLog(15),
  });
}

/** POST — send test payload to webhook (admin) */
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { googleSheetsWebhookUrl } = getSettings();
  if (!googleSheetsWebhookUrl) {
    return NextResponse.json(
      { error: "googleSheetsWebhookUrl غير مضبوط" },
      { status: 400 }
    );
  }

  const result = await sendTestWebhook(googleSheetsWebhookUrl);
  recordWebhookDelivery("SM-TEST-WEBHOOK", "test", result);

  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    statusText: result.statusText,
    responseBody: result.responseBody,
    error: result.error,
    durationMs: result.durationMs,
    payload: result.payload,
    url: result.url,
  });
}
