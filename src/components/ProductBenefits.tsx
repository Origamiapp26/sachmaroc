const DEFAULT_BENEFITS = [
  "💵 الدفع عند الاستلام — بلا مخاطرة",
  "🚚 توصيل لجميع المدن المغربية",
  "⭐ منتجات أصلية ومختارة بعناية",
];

export default function ProductBenefits({
  items = DEFAULT_BENEFITS,
  compact = false,
}: {
  items?: string[];
  compact?: boolean;
}) {
  return (
    <ul className={compact ? "space-y-1.5" : "space-y-2"}>
      {items.map((text) => (
        <li
          key={text}
          className={`flex items-start gap-2 font-medium text-ink dark:text-white ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          <span className="mt-0.5 text-whatsapp">✓</span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
