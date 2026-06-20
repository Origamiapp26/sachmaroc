import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getActiveWebhookUrl, getWebhookConfigDebug } from "@/lib/webhook-config";
import { sendDebugWebhook } from "@/lib/order-webhook";
import { getWebhookLog, recordWebhookDelivery } from "@/lib/webhook-log";

export const runtime = "nodejs";

/** GET — webhook config + recent delivery log (admin) */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const config = getWebhookConfigDebug();
  const webhookUrl = getActiveWebhookUrl();

  return NextResponse.json({
    configured: Boolean(webhookUrl),
    url: webhookUrl,
    source: config.source,
    envVarSet: config.envVarSet,
    recentDeliveries: getWebhookLog(15),
  });
}

/** POST — send test payload to webhook (admin) */
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const webhookUrl = getActiveWebhookUrl();
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "googleSheetsWebhookUrl غير مضبوط" },
      { status: 400 }
    );
  }

  const result = await sendDebugWebhook(webhookUrl);
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
