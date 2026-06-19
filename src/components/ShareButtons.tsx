"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      copyLink();
    }
  };

  const waShare = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={share}
        className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium dark:border-neutral-700"
      >
        مشاركة
      </button>
      <button
        onClick={copyLink}
        className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium dark:border-neutral-700"
      >
        {copied ? "تم النسخ ✓" : "نسخ الرابط"}
      </button>
      <a
        href={waShare}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-whatsapp px-4 py-2 text-xs font-medium text-white"
      >
        واتساب
      </a>
    </div>
  );
}
