import { revalidatePath } from "next/cache";

/** يحدّث صفحات المتجر بعد تغيير المنتجات */
export function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[id]", "page");
  revalidatePath("/api/products");
}

export function revalidateSettings() {
  revalidatePath("/", "layout");
  revalidatePath("/api/settings");
}
