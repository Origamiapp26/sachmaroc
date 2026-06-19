"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "لوحة التحكم", icon: "📊" },
  { href: "/admin/products", label: "المنتجات", icon: "📦" },
  { href: "/admin/orders", label: "الطلبات", icon: "🛒" },
  { href: "/admin/categories", label: "الفئات", icon: "🏷️" },
  { href: "/admin/coupons", label: "الخصومات", icon: "🎫" },
  { href: "/admin/settings", label: "الإعدادات", icon: "⚙️" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <aside className="hidden w-64 shrink-0 border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:block">
        <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
          <Link href="/admin" className="text-lg font-bold text-ink dark:text-white">
            Sach<span className="text-whatsapp">Maroc</span>
          </Link>
          <p className="mt-1 text-xs text-ink-muted">لوحة الإدارة</p>
        </div>
        <nav className="space-y-1 p-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-ink text-white dark:bg-whatsapp dark:text-white"
                  : "text-ink-muted hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <Link href="/" className="mb-2 block text-sm text-ink-muted hover:text-ink">
            ← الموقع
          </Link>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-600">
            خروج
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/admin" className="font-bold text-ink dark:text-white">
              Sach<span className="text-whatsapp">Maroc</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-700"
              >
                {menuOpen ? "إغلاق" : "القائمة"}
              </button>
              <button onClick={logout} className="text-xs text-red-500">
                خروج
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="border-t border-neutral-100 p-2 dark:border-neutral-800">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`mb-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-ink text-white dark:bg-whatsapp"
                      : "text-ink-muted"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <nav className="flex gap-1 overflow-x-auto border-t border-neutral-100 px-2 py-2 dark:border-neutral-800">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium ${
                  isActive(item.href)
                    ? "bg-ink text-white dark:bg-whatsapp"
                    : "bg-neutral-100 text-ink-muted dark:bg-neutral-800"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
