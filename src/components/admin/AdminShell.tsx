"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "لوحة التحكم", icon: "📊" },
  { href: "/admin/products", label: "المنتجات", icon: "📦" },
  { href: "/admin/categories", label: "الفئات", icon: "🏷️" },
  { href: "/admin/orders", label: "الطلبات", icon: "🛒" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:block">
        <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
          <Link href="/admin" className="text-lg font-bold text-ink dark:text-white">
            Sach<span className="text-whatsapp">Maroc</span>
          </Link>
          <p className="mt-1 text-xs text-ink-muted">لوحة الإدارة</p>
        </div>
        <nav className="p-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                pathname === item.href
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

      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 md:hidden">
          <Link href="/admin" className="font-bold text-ink dark:text-white">Admin</Link>
          <button onClick={logout} className="text-sm text-red-500">خروج</button>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
