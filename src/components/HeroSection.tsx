import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-whatsapp-light/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[85vh] flex-col items-center justify-center py-16 lg:flex-row lg:gap-16 lg:py-0">
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-right">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp-light/60 px-4 py-1.5 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
              <span className="text-xs font-medium text-ink">
                منتجات مغربية أصلية
              </span>
            </div>

            <h1
              className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-ink opacity-0 animate-fade-up sm:text-5xl md:text-6xl"
              style={{ animationDelay: "0.2s" }}
            >
              مرحبا بكم فـ{" "}
              <span className="text-whatsapp">SachMaroc</span>
            </h1>

            <p
              className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted opacity-0 animate-fade-up sm:text-lg"
              style={{ animationDelay: "0.35s" }}
            >
              لقا أفضل المنتجات بأثمنة مناسبة والتوصيل لجميع المدن المغربية
            </p>

            <div
              className="mt-10 flex flex-col gap-3 opacity-0 animate-fade-up sm:flex-row sm:gap-4"
              style={{ animationDelay: "0.5s" }}
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
              >
                شوف المنتجات
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-8 py-3.5 text-sm font-semibold text-ink transition-all hover:border-whatsapp hover:bg-whatsapp-light"
              >
                الأكثر مبيعاً
              </Link>
            </div>

            <div
              className="mt-14 flex flex-wrap items-center justify-center gap-8 opacity-0 animate-fade-up lg:justify-start"
              style={{ animationDelay: "0.65s" }}
            >
              {[
                { value: "+2000", label: "زبون راضي" },
                { value: "4.9★", label: "تقييم ممتاز" },
                { value: "48س", label: "توصيل سريع" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-right">
                  <p className="text-xl font-bold text-ink">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative mt-12 flex flex-1 items-center justify-center opacity-0 animate-fade-up lg:mt-0"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute -inset-4 rounded-[2rem] border border-neutral-100" />
              <div className="relative overflow-hidden rounded-3xl bg-neutral-50 shadow-luxury animate-float">
                <img
                  src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80"
                  alt="منتجات مغربية SachMaroc"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-5 right-5 left-5 rounded-2xl bg-white/95 p-4 shadow-soft backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-whatsapp">
                        الأكثر مبيعاً
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-ink">
                        جلابة تقليدية فاخرة
                      </p>
                    </div>
                    <p className="text-lg font-bold text-ink">899 د.م</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 top-12 hidden rounded-2xl bg-white p-4 shadow-luxury sm:block lg:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-whatsapp-light">
                    <svg
                      className="h-5 w-5 text-whatsapp"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">طلب عبر واتساب</p>
                    <p className="text-[11px] text-ink-faint">
                      الدفع عند الاستلام
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
