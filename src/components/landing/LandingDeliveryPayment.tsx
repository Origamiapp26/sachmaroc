"use client";

import { useSettings } from "@/context/SettingsContext";

export default function LandingDeliveryPayment() {
  const { delivery } = useSettings();

  const items =
    delivery.items.length > 0
      ? delivery.items
      : [
          { icon: "🚚", title: "توصيل سريع", text: "48-72 ساعة لمعظم المدن المغربية" },
          { icon: "💵", title: "الدفع عند الاستلام", text: "خلص كاش ملي توصلك الطلبية — بلا بطاقة بنكية" },
          { icon: "📞", title: "تأكيد الطلب", text: "غادي نتاصلو بيك فالتليفون باش نأكدو العنوان والموعد" },
        ];

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-whatsapp">التوصيل والدفع</p>
          <h2 className="mt-2 text-2xl font-bold text-ink dark:text-white sm:text-3xl">
            {delivery.title || "توصيل آمن ودفع عند الاستلام"}
          </h2>
          {delivery.description && (
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-muted">{delivery.description}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border-2 border-whatsapp/15 bg-whatsapp-light/20 p-5 text-center dark:bg-whatsapp/5"
            >
              <span className="text-3xl" aria-hidden>{item.icon}</span>
              <h3 className="mt-3 text-sm font-bold text-ink dark:text-white">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
