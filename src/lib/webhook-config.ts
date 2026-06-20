import { readFileSync } from "fs";
import path from "path";
import { getSettings } from "@/lib/settings";

export const PRODUCTION_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzupenSEq8OdjTi0XTmJIjHmA0vEVdz87M3dqzAdMP8cL8O17VpxiC3tu4axfomS9pe/exec";

export interface WebhookConfigDebug {
  webhookUrl: string;
  envVarSet: boolean;
  envVarValue: string;
  settingsFileValue: string;
  source: "GOOGLE_SHEETS_WEBHOOK_URL" | "settings.json" | "none";
  matchesExpectedProductionUrl: boolean;
}

export function getWebhookConfigDebug(): WebhookConfigDebug {
  const envRaw = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() || "";
  let settingsFileValue = "";
  try {
    const raw = readFileSync(path.join(process.cwd(), "data", "settings.json"), "utf-8");
    settingsFileValue =
      (JSON.parse(raw) as { googleSheetsWebhookUrl?: string }).googleSheetsWebhookUrl?.trim() ||
      "";
  } catch {
    settingsFileValue = "";
  }

  const webhookUrl = getSettings().googleSheetsWebhookUrl.trim();
  const source: WebhookConfigDebug["source"] = envRaw
    ? "GOOGLE_SHEETS_WEBHOOK_URL"
    : settingsFileValue
      ? "settings.json"
      : "none";

  return {
    webhookUrl,
    envVarSet: Boolean(envRaw),
    envVarValue: envRaw,
    settingsFileValue,
    source,
    matchesExpectedProductionUrl: webhookUrl === PRODUCTION_WEBHOOK_URL,
  };
}

export function getActiveWebhookUrl(): string {
  return getWebhookConfigDebug().webhookUrl;
}
