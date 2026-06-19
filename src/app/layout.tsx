import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma";

  return {
    metadataBase: new URL(base),
    title: {
      default: settings.seo.defaultTitle,
      template: `%s | ${settings.storeName}`,
    },
    description: settings.seo.defaultDescription,
    keywords: ["متجر مغربي", "تسوق أونلاين", "المغرب", "الدفع عند الاستلام", "منتجات مغربية"],
    openGraph: {
      type: "website",
      locale: "ar_MA",
      siteName: settings.storeName,
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={notoArabic.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
