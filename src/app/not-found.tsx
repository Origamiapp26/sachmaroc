import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-ink">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">الصفحة ما لقيناهاش</h1>
      <p className="mt-2 text-sm text-ink-muted">
        الصفحة اللي بغيتي ما كايناش أو تبدلات
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-ink px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
      >
        رجع للرئيسية
      </Link>
    </div>
  );
}
