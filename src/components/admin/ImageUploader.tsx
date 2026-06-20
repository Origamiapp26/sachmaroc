"use client";

import { useRef, useState } from "react";
import ProductImage from "@/components/ProductImage";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageUploader({ label, value, onChange, hint }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "وقع خطأ فالرفع");
      setUploading(false);
      return;
    }

    onChange(data.url);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-ink-muted">{label}</label>
      {hint && <p className="mt-0.5 text-[11px] text-ink-faint">{hint}</p>}

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
        {value ? (
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
            <ProductImage src={value} alt="" fill className="object-cover" sizes="112px" />
          </div>
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-xs text-ink-muted dark:border-neutral-700">
            بلا صورة
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="رابط الصورة أو ارفع من الجهاز"
            dir="ltr"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-whatsapp"
            >
              {uploading ? "كيترفع..." : "رفع صورة"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium text-ink-muted dark:border-neutral-700"
              >
                حذف
              </button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface GalleryUploaderProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export function GalleryUploader({ label, value, onChange }: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "وقع خطأ فالرفع");
      setUploading(false);
      return;
    }

    onChange([...value, data.url]);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-ink-muted">{label}</label>

      <div className="mt-2 flex flex-wrap gap-2">
        {value.map((url) => (
          <div
            key={url}
            className="group relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700"
          >
            <ProductImage src={url} alt="" fill className="object-cover" sizes="80px" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              حذف
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-2xl text-ink-muted dark:border-neutral-700"
        >
          {uploading ? "..." : "+"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
