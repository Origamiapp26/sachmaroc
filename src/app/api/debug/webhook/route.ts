import { NextResponse } from "next/server";
import { sendDebugWebhook } from "@/lib/order-webhook";
import {
  getWebhookConfigDebug,
  PRODUCTION_WEBHOOK_URL,
} from "@/lib/webhook-config";

export const runtime = "nodejs";

/** Temporary — diagnose Google Sheets webhook from production */
export async function GET() {
  const config = getWebhookConfigDebug();
  const webhookUrl = config.webhookUrl || PRODUCTION_WEBHOOK_URL;

  const result = await sendDebugWebhook(webhookUrl);

  return NextResponse.json({
    success: result.ok,
    status: result.status,
    statusText: result.statusText,
    response: result.responseBody,
    error: result.error,
    durationMs: result.durationMs,
    webhookUrl: result.url,
    requestPayload: result.payload,
    config: {
      source: config.source,
      envVarSet: config.envVarSet,
      envVarMatchesExpected:
        config.envVarValue === PRODUCTION_WEBHOOK_URL || !config.envVarSet,
      settingsFileMatchesExpected:
        config.settingsFileValue === PRODUCTION_WEBHOOK_URL,
      matchesExpectedProductionUrl: config.matchesExpectedProductionUrl,
      expectedUrl: PRODUCTION_WEBHOOK_URL,
    },
  });
}
