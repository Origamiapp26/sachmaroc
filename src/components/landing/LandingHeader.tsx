"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function LandingHeader() {
  const { storeName } = useSettings();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToOrder = () => {
    document.getElementById("landing-order-hero")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between gap-3 px-4 sm:h-14">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-whatsapp text-xs font-bold text-white">
            S
          </span>
          <span className="truncate text-sm font-bold text-ink dark:text-white sm:text-base">
            {storeName}
          </span>
        </div>

        {scrolled && (
          <button
            type="button"
            onClick={scrollToOrder}
            className="shrink-0 rounded-full bg-whatsapp px-4 py-2 text-xs font-bold text-white shadow-md sm:text-sm lg:hidden"
          >
            اطلب الآن
          </button>
        )}

        <span className="hidden text-[10px] font-semibold text-whatsapp lg:inline">
          💵 الدفع عند الاستلام
        </span>
      </div>
    </header>
  );
}
