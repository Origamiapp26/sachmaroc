import { CartProvider } from "@/context/CartContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PromoBanner from "@/components/PromoBanner";
import StoreAnalytics from "@/components/StoreAnalytics";
import { getSettings } from "@/lib/settings";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();

  return (
    <SettingsProvider settings={settings}>
      <CartProvider>
        <Suspense fallback={null}>
          <StoreAnalytics
            facebookPixelId={settings.facebookPixelId}
            googleAnalyticsId={settings.googleAnalyticsId}
          />
        </Suspense>
        <PromoBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </CartProvider>
    </SettingsProvider>
  );
}
