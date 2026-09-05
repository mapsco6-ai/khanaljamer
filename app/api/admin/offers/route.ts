import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { offers } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { deleteFile, putFile } from "@/lib/storage";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const dateOrNull = (value: FormDataEntryValue | null) => value ? new Date(String(value)) : null;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("image");
  const title = String(form.get("title") || "").trim().slice(0, 120);
  const description = String(form.get("description") || "").trim().slice(0, 500);
  const oldPrice = form.get("oldPrice") ? Number(form.get("oldPrice")) : null;
  const newPrice = Number(form.get("newPrice"));
  if (!title || !Number.isInteger(newPrice) || newPrice < 0 || (oldPrice !== null && (!Number.isInteger(oldPrice) || oldPrice < 0))) return Response.json({ error: "أكمل بيانات العرض بصورة صحيحة" }, { status: 400 });
  let imageKey: string | null = null;
  if (file instanceof File && file.size) {
    if (!allowedTypes.has(file.type) || file.size > 8 * 1024 * 1024) return Response.json({ error: "الصورة يجب أن تكون JPG أو PNG أو WEBP وبحجم أقل من 8MB" }, { status: 400 });
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    imageKey = `offer-${crypto.randomUUID()}.${ext}`;
    await putFile(imageKey, await file.arrayBuffer());
  }
  const now = new Date(); const id = `offer-${crypto.randomUUID()}`;
  await getDb().insert(offers).values({ id, title, description, oldPrice, newPrice, imageKey, startsAt: dateOrNull(form.get("startsAt")), endsAt: dateOrNull(form.get("endsAt")), active: true, createdAt: now, updatedAt: now });
  return Response.json({ ok: true, id });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const data = await request.json() as { id?: string; active?: boolean };
  if (!data.id) return Response.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  await getDb().update(offers).set({ active: data.active !== false, updatedAt: new Date() }).where(eq(offers.id, data.id));
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") || "";
  const [offer] = await getDb().select().from(offers).where(eq(offers.id, id)).limit(1);
  if (offer?.imageKey) await deleteFile(offer.imageKey);
  await getDb().delete(offers).where(eq(offers.id, id));
  return Response.json({ ok: true });
}
