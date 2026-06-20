"use client";

import { formatPrice } from "@/lib/utils";

export default function LandingStickyCTA({
  formId,
  total,
  loading,
}: {
  formId: string;
  total: number;
  loading?: boolean;
}) {
  const scrollToForm = () => {
    document.getElementById(formId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 p-2.5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden">
      <div className="mb-1.5 flex items-center justify-between px-1 text-xs">
        <button type="button" onClick={scrollToForm} className="text-ink-muted underline">
          شوف التفاصيل
        </button>
        <span className="font-bold text-whatsapp">{formatPrice(total)}</span>
      </div>
      <button
        type="submit"
        form={formId}
        disabled={loading}
        className="w-full rounded-full bg-whatsapp py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-50"
      >
        {loading ? "كيتسجل..." : "اطلب الآن — الدفع عند الاستلام"}
      </button>
    </div>
  );
}
