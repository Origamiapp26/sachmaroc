"use client";

import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function PromoBanner() {
  const { banners } = useSettings();
  const active = banners.filter((b) => b.active);
  if (active.length === 0) return null;

  const banner = active[0];
  return (
    <div className="bg-ink py-2.5 text-center text-sm font-medium text-white dark:bg-whatsapp">
      <Link href={banner.link} className="hover:underline">
        {banner.text}
      </Link>
    </div>
  );
}
