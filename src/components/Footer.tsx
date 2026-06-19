import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                S
              </span>
              <span className="text-lg font-semibold tracking-tight text-ink">
                Sach<span className="text-brand-600">Maroc</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              Boutique premium de produits d&apos;exception, inspirée par
              l&apos;artisanat marocain. Livraison dans tout le Maroc avec
              paiement à la livraison.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink">Boutique</h4>
            <ul className="mt-4 space-y-3">
              {["Catalogue", "Best-sellers", "Nouveautés"].map((item) => (
                <li key={item}>
                  <Link
                    href="/catalog"
                    className="text-sm text-ink-muted transition-colors hover:text-brand-600"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink">Service client</h4>
            <ul className="mt-4 space-y-3">
              {[
                "Paiement à la livraison",
                "Livraison 48h",
                "Retours 14 jours",
              ].map((item) => (
                <li key={item} className="text-sm text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} SachMaroc. Tous droits réservés.
          </p>
          <p className="text-xs text-ink-faint">
            Fait avec passion au Maroc 🇲🇦
          </p>
        </div>
      </div>
    </footer>
  );
}
