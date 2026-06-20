export default function CashOnDeliveryBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-whatsapp/30 bg-whatsapp-light/60 px-3 py-1.5 text-xs font-bold text-whatsapp-dark dark:text-whatsapp">
        <span aria-hidden>💵</span>
        <span>الدفع عند الاستلام</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-whatsapp/20 bg-whatsapp-light/50 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-whatsapp-light">
        <svg
          className="h-5 w-5 text-whatsapp"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-ink">الدفع عند الاستلام</p>
        <p className="text-xs text-ink-muted">
          خلّص كاش ملي توصلك الطلبية
        </p>
      </div>
    </div>
  );
}
