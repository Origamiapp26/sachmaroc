import { CartProvider } from "@/context/CartContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PromoBanner from "@/components/PromoBanner";
import { getSettings } from "@/lib/settings";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();

  return (
    <SettingsProvider settings={settings}>
      <CartProvider>
        <PromoBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </CartProvider>
    </SettingsProvider>
  );
}
