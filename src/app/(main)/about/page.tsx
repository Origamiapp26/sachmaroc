export const metadata = {
  title: "من نحن — SachMaroc",
  description: "تعرف على قصة SachMaroc ورسالتنا",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">
          قصتنا
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-ink">من نحن</h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-8">
        <div className="overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1200&q=80"
            alt="SachMaroc"
            className="aspect-[21/9] w-full object-cover"
          />
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-ink-muted">
          <p>
            <strong className="text-ink">SachMaroc</strong> هو متجر مغربي
            أونلاين تأسس باش يقرب ليك أحسن المنتجات المغربية الأصلية. من
            الجلابات والقفاطين لزيت الأركان والطواجن الفخارية، كنختارو كل
            منتج بعناية من حرفيين وموردين موثوقين.
          </p>
          <p>
            رسالتنا بسيطة: نقدمو ليك جودة عالية بأثمنة مناسبة، مع خدمة زبناء
            ممتازة عبر واتساب والدفع عند الاستلام لراحتك.
          </p>
          <p>
            كنآمنو بالتجارة العادلة وبدعم الحرفيين المغاربة. كل عملية شراء
            منك كتساهم فالحفاظ على التراث والحرف التقليدية.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { value: "+2000", label: "زبون راضي" },
            { value: "8+", label: "فئات منتجات" },
            { value: "100%", label: "منتجات مغربية" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-100 bg-white p-6 text-center shadow-card"
            >
              <p className="text-2xl font-bold text-ink">{stat.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
