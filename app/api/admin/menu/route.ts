import { getDb } from "@/db";
import { customMenuItems, menuOverrides } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { defaultMenu } from "@/lib/menu-data";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const data = await request.json() as { id?: string; name?: string; price?: number; available?: boolean };
  const source = defaultMenu.find((item) => item.id === data.id);
  const price = Number(data.price);
  if (!data.id || !Number.isInteger(price) || price < 0 || price > 1_000_000) return Response.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  if (!source) {
    const values = { name: String(data.name || "").trim().slice(0, 100), price, available: data.available !== false, updatedAt: new Date() };
    if (!values.name) return Response.json({ error: "اسم الوجبة مطلوب" }, { status: 400 });
    await getDb().update(customMenuItems).set(values).where(eq(customMenuItems.id, data.id));
    return Response.json({ ok: true });
  }
  const values = { itemId: source.id, name: String(data.name || source.name).trim().slice(0, 100), price, available: data.available !== false, updatedAt: new Date() };
  await getDb().insert(menuOverrides).values(values).onConflictDoUpdate({ target: menuOverrides.itemId, set: { name: values.name, price: values.price, available: values.available, updatedAt: values.updatedAt } });
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("image");
  const name = String(form.get("name") || "").trim().slice(0, 100);
  const category = String(form.get("category") || "").trim().slice(0, 80);
  const description = String(form.get("description") || "").trim().slice(0, 500);
  const price = Number(form.get("price"));
  if (!name || !category || !Number.isInteger(price) || price < 0 || price > 1_000_000) return Response.json({ error: "أكمل بيانات الوجبة بصورة صحيحة" }, { status: 400 });
  const id = `custom-${crypto.randomUUID()}`;
  let imageKey: string | null = null;
  if (file instanceof File && file.size) {
    const uploaded = await uploadMenuFile(file, `menu-${id}`);
    if (uploaded instanceof Response) return uploaded;
    imageKey = uploaded;
  }
  const now = new Date();
  await getDb().insert(customMenuItems).values({ id, name, category, price, description, imageKey, available: true, createdAt: now, updatedAt: now });
  return Response.json({ ok: true, id });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!id.startsWith("custom-")) return Response.json({ error: "يمكن حذف الوجبات المضافة فقط" }, { status: 400 });
  const [item] = await getDb().select().from(customMenuItems).where(eq(customMenuItems.id, id)).limit(1);
  if (item?.imageKey) { const { env } = await import("cloudflare:workers"); await env.BUCKET.delete(item.imageKey); }
  await getDb().delete(customMenuItems).where(eq(customMenuItems.id, id));
  return Response.json({ ok: true });
}

async function uploadMenuFile(file: File, prefix: string) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type) || file.size > 8 * 1024 * 1024) return Response.json({ error: "استخدم JPG أو PNG أو WEBP بحجم لا يتجاوز 8MB" }, { status: 400 });
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `${prefix}-${crypto.randomUUID()}.${extension}`;
  const { env } = await import("cloudflare:workers");
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  return key;
}
