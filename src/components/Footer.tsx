import Link from "next/link";
import { buildWhatsAppContactUrl } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
                S
              </span>
              <span className="text-lg font-bold tracking-tight text-ink">
                Sach<span className="text-whatsapp">Maroc</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              متجر مغربي أونلاين كيقدم ليك منتجات مختارة بعناية من التقليد
              والعناية والديكور. الدفع عند الاستلام والتوصيل لجميع المدن
              المغربية.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink">المتجر</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  المنتجات
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  أسئلة شائعة
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink">تواصل معنا</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <a
                  href={buildWhatsAppContactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-whatsapp transition-colors hover:text-whatsapp-dark"
                >
                  واتساب
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} SachMaroc. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-ink-faint">صنع بشغف فالمغرب 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}
