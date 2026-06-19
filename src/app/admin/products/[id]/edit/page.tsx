"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { Product } from "@/types/product";

export default function EditProductPage() {
  const ready = useAdminAuth();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([productData, cats]) => {
      if (productData.error) {
        setProduct(null);
      } else {
        setProduct(productData);
      }
      setCategories(cats.map((c: { name: string }) => c.name));
      setLoading(false);
    });
  }, [ready, id]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-muted">
        كيتحمّل...
      </div>
    );
  }

  if (!product) {
    return (
      <AdminShell>
        <p className="text-ink-muted">المنتج ما لقيناهش</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink dark:text-white">تعديل المنتج</h1>
      <p className="mt-1 text-sm text-ink-muted">{product.name}</p>
      <div className="mt-8 max-w-3xl rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
        <ProductForm product={product} categories={categories} />
      </div>
    </AdminShell>
  );
}
