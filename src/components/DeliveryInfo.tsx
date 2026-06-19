export default function DeliveryInfo() {
  const items = [
    {
      title: "التوصيل لجميع المدن",
      description: "كنوصلو لكازا، الرباط، مراكش، طنجة، فاس وجميع المدن المغربية.",
    },
    {
      title: "مدة التوصيل",
      description: "من 24 ل 72 ساعة حسب المدينة. كنعلموك بالتتبع عبر واتساب.",
    },
    {
      title: "شحن مجاني",
      description: "التوصيل مجاني لجميع الطلبيات فالمغرب.",
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6">
      <h3 className="text-sm font-bold text-ink">معلومات التوصيل</h3>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-whatsapp"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
