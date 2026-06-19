import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!allowed.includes(ext)) {
    throw new Error("نوع الملف غير مدعوم");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("الصورة كبيرة بزاف (الحد الأقصى 5MB)");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${nanoid()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}
