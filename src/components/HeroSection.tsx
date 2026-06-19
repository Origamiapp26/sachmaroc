import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute -right-32 top-0 h-[600px] w-[600px] rounded-full bg-brand-100/30 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-brand-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[90vh] flex-col items-center justify-center py-20 lg:min-h-[85vh] lg:flex-row lg:gap-16 lg:py-0">
          {/* Copy */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 opacity-0 backdrop-blur-sm animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              <span className="text-xs font-medium tracking-wide text-brand-700">
                Nouvelle collection 2026
              </span>
            </div>

            <h1
              className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-ink opacity-0 animate-fade-up sm:text-5xl md:text-6xl lg:text-[4.25rem]"
              style={{ animationDelay: "0.2s" }}
            >
              L&apos;élégance{" "}
              <span className="bg-blue-gradient bg-clip-text text-transparent">
                marocaine
              </span>
              , réinventée.
            </h1>

            <p
              className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted opacity-0 animate-fade-up sm:text-lg"
              style={{ animationDelay: "0.35s" }}
            >
              Découvrez une sélection premium d&apos;accessoires et de pièces
              d&apos;exception, façonnés par l&apos;artisanat marocain avec une
              finition luxe.
            </p>

            <div
              className="mt-10 flex flex-col gap-3 opacity-0 animate-fade-up sm:flex-row sm:gap-4"
              style={{ animationDelay: "0.5s" }}
            >
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30"
              >
                Explorer la collection
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-ink transition-all hover:border-brand-300 hover:bg-brand-50"
              >
                Voir les best-sellers
              </Link>
            </div>

            {/* Trust signals */}
            <div
              className="mt-14 flex flex-wrap items-center justify-center gap-8 opacity-0 animate-fade-up lg:justify-start"
              style={{ animationDelay: "0.65s" }}
            >
              {[
                { value: "2 000+", label: "Clients satisfaits" },
                { value: "4.9★", label: "Note moyenne" },
                { value: "48h", label: "Livraison Maroc" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-xl font-semibold tracking-tight text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div
            className="relative mt-16 flex flex-1 items-center justify-center opacity-0 animate-fade-up lg:mt-0"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-[2rem] border border-brand-100/80" />
              <div className="absolute -inset-8 rounded-[2.5rem] border border-brand-50" />

              {/* Main image */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-luxury animate-float">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"
                  alt="Sac cuir premium SachMaroc"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />

                {/* Floating card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-soft backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                        Best-seller
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-ink">
                        Sac Cuir Premium
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-ink">1 299 MAD</p>
                  </div>
                </div>
              </div>

              {/* Secondary floating element */}
              <div className="absolute -right-4 top-12 hidden rounded-2xl bg-white p-4 shadow-luxury sm:block lg:-right-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      Commande WhatsApp
                    </p>
                    <p className="text-[11px] text-ink-faint">
                      Paiement à la livraison
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
