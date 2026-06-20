import { SettingsProvider } from "@/context/SettingsContext";
import StoreAnalytics from "@/components/StoreAnalytics";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { getSettings } from "@/lib/settings";
import { Suspense } from "react";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();

  return (
    <SettingsProvider settings={settings}>
      <Suspense fallback={null}>
        <StoreAnalytics
          facebookPixelId={settings.facebookPixelId}
          googleAnalyticsId={settings.googleAnalyticsId}
        />
      </Suspense>
      <LandingHeader />
      <main className="min-h-screen bg-white dark:bg-neutral-950">{children}</main>
      <LandingFooter />
    </SettingsProvider>
  );
}
