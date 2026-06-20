export default function DeliveryBadge({ text = "توصيل 48-72h لجميع المدن" }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
      <span aria-hidden>🚚</span>
      <span>{text}</span>
    </div>
  );
}
