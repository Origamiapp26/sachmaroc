"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { buildWhatsAppContactUrl } from "@/lib/utils";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  const { storeName, contact, social, seo } = useSettings();
  const brand = storeName || "SachMaroc";

  return (
    <footer className="border-t border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <NewsletterSignup />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white dark:bg-whatsapp">
                S
              </span>
              <span className="text-lg font-bold text-ink dark:text-white">{brand}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              {seo.defaultDescription}
            </p>
            {contact.address && (
              <p className="mt-2 text-sm text-ink-faint">{contact.address}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink dark:text-white">المتجر</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/products" className="text-sm text-ink-muted hover:text-ink">المنتجات</Link></li>
              <li><Link href="/orders" className="text-sm text-ink-muted hover:text-ink">طلباتي</Link></li>
              <li><Link href="/about" className="text-sm text-ink-muted hover:text-ink">من نحن</Link></li>
              <li><Link href="/faq" className="text-sm text-ink-muted hover:text-ink">أسئلة شائعة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink dark:text-white">تواصل معنا</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/contact" className="text-sm text-ink-muted hover:text-ink">اتصل بنا</Link></li>
              <li>
                <a href={buildWhatsAppContactUrl()} target="_blank" rel="noopener noreferrer" className="text-sm text-whatsapp">
                  واتساب
                </a>
              </li>
              {social.instagram && (
                <li><a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-muted hover:text-ink">إنستغرام</a></li>
              )}
              {social.facebook && (
                <li><a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-muted hover:text-ink">فيسبوك</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 dark:border-neutral-800 sm:flex-row">
          <p className="text-xs text-ink-faint">© {new Date().getFullYear()} {brand}. جميع الحقوق محفوظة.</p>
          <p className="text-xs text-ink-faint">صنع بشغف فالمغرب 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}
