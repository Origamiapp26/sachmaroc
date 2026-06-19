"use client";

import { useState } from "react";

const faqs = [
  {
    question: "كيفاش نطلب منتج؟",
    answer:
      "تقدر تزيد المنتجات للسلة وتكمل الطلب عبر واتساب، أو تضغط مباشرة على زر 'اطلب عبر واتساب' فأي منتج. غادي نجاوبوك ونأكدو الطلبية.",
  },
  {
    question: "شنو هي طريقة الدفع؟",
    answer:
      "كنقبلو الدفع عند الاستلام (COD) فقط. تخلص كاش ملي يوصلك الطلب عند الباب.",
  },
  {
    question: "شحال كتاخد التوصيل؟",
    answer:
      "التوصيل كيكون من 24 ل 72 ساعة حسب المدينة. المدن الكبرى كازا والرباط ومراكش عادة فـ 24-48 ساعة.",
  },
  {
    question: "واش التوصيل مجاني؟",
    answer: "نعم، التوصيل مجاني لجميع الطلبيات فالمغرب.",
  },
  {
    question: "واش نقدر نرجع المنتج؟",
    answer:
      "إلا كان المنتج فيه مشكل أو ما مطابقش للوصف، تواصل معنا عبر واتساب خلال 48 ساعة وغادي نلقاو حل.",
  },
  {
    question: "واش كتوصلو لجميع المدن؟",
    answer:
      "نعم، كنوصلو لجميع المدن والقرى المغربية عبر شركاء التوصيل ديالنا.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">
          مساعدة
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-ink">
          أسئلة شائعة
        </h1>
      </div>

      <div className="mx-auto max-w-2xl space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-card"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="flex w-full items-center justify-between px-6 py-5 text-right"
            >
              <span className="text-sm font-bold text-ink">{faq.question}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-ink-muted transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="border-t border-neutral-100 px-6 py-4">
                <p className="text-sm leading-relaxed text-ink-muted">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
