"use client";

import { useSettings } from "@/context/SettingsContext";

export default function TrustBar() {
  const { trustBar } = useSettings();
  if (!trustBar?.length) return null;

  return (
    <section className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 sm:grid-cols-4 sm:gap-6 sm:px-6 lg:px-8">
        {trustBar.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-2.5 text-center sm:justify-start sm:text-right"
          >
            <span className="text-xl sm:text-2xl" aria-hidden>
              {item.icon}
            </span>
            <span className="text-xs font-semibold text-ink dark:text-white sm:text-sm">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
