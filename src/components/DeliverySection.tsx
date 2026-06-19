"use client";

import { useSettings } from "@/context/SettingsContext";

export default function DeliverySection() {
  const { delivery } = useSettings();

  return (
    <section className="bg-neutral-50/50 py-16 dark:bg-neutral-900/50 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">التوصيل</p>
          <h2 className="text-3xl font-bold text-ink dark:text-white">{delivery.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-muted">{delivery.description}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {delivery.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 text-center shadow-card dark:bg-neutral-900"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-4 font-bold text-ink dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
