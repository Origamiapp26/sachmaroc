import { ORDER_STATUS_LABELS } from "@/lib/utils";
import type { OrderStatus } from "@/types/product";

const STEPS: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderTrackingTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950">
        الطلب ملغى
      </p>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:gap-0">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 flex-col items-center sm:flex-row">
            <div className="flex flex-col items-center text-center sm:flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-whatsapp text-white"
                    : "bg-neutral-200 text-ink-muted dark:bg-neutral-700"
                } ${active ? "ring-4 ring-whatsapp/30" : ""}`}
              >
                {done ? "✓" : i + 1}
              </div>
              <p className={`mt-2 text-xs font-medium ${done ? "text-ink dark:text-white" : "text-ink-faint"}`}>
                {ORDER_STATUS_LABELS[step]}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`hidden h-0.5 flex-1 sm:block ${
                  i < currentIndex ? "bg-whatsapp" : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
