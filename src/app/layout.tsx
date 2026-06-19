import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sachmaroc.ma"),
  title: {
    default: "SachMaroc — متجر مغربي أونلاين",
    template: "%s | SachMaroc",
  },
  description:
    "لقا أفضل المنتجات المغربية بأثمنة مناسبة. الدفع عند الاستلام والتوصيل لجميع المدن المغربية.",
  keywords: ["متجر مغربي", "تسوق أونلاين", "المغرب", "الدفع عند الاستلام", "منتجات مغربية"],
  openGraph: {
    type: "website",
    locale: "ar_MA",
    siteName: "SachMaroc",
  },
};

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
