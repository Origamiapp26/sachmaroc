import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-semibold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Page introuvable</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Le produit ou la page que vous cherchez n&apos;existe pas.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
