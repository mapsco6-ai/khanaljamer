import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { customMenuItems, menuOverrides } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { defaultMenu } from "@/lib/menu-data";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const form = await request.formData();
  const itemId = String(form.get("itemId") ?? "");
  const file = form.get("image");
  const source = defaultMenu.find((item) => item.id === itemId);
  const [custom] = source ? [] : await getDb().select().from(customMenuItems).where(eq(customMenuItems.id, itemId)).limit(1);
  if ((!source && !custom) || !(file instanceof File)) return Response.json({ error: "الوجبة أو الصورة غير صحيحة" }, { status: 400 });
  if (!allowedTypes.has(file.type) || file.size > 8 * 1024 * 1024) return Response.json({ error: "استخدم JPG أو PNG أو WEBP بحجم لا يتجاوز 8MB" }, { status: 400 });

  const db = getDb();
  const [current] = source ? await db.select().from(menuOverrides).where(eq(menuOverrides.itemId, itemId)).limit(1) : [];
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `menu-${itemId}-${crypto.randomUUID()}.${extension}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });

  if (source) {
    const values = { itemId, name: current?.name ?? source.name, price: current?.price ?? source.price, imageKey: key, available: current?.available ?? source.available, updatedAt: new Date() };
    await db.insert(menuOverrides).values(values).onConflictDoUpdate({ target: menuOverrides.itemId, set: { imageKey: key, updatedAt: values.updatedAt } });
  } else await db.update(customMenuItems).set({ imageKey: key, updatedAt: new Date() }).where(eq(customMenuItems.id, itemId));
  const oldKey = current?.imageKey ?? custom?.imageKey;
  if (oldKey) await env.BUCKET.delete(oldKey);
  return Response.json({ image: `/api/menu-image/${encodeURIComponent(key)}` });
}
