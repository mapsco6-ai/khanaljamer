import { getDb } from "@/db";
import { complaints } from "@/db/schema";

export async function POST(request: Request) {
  const data = await request.json() as Record<string, unknown>;
  const message = String(data.message ?? "").trim();
  const type = String(data.type ?? "شكوى").slice(0, 30);
  const area = String(data.area ?? "أخرى").slice(0, 30);
  const tableNumber = String(data.tableNumber ?? "").trim().slice(0, 12) || null;
  const rating = Math.min(5, Math.max(1, Number(data.rating) || 5));
  if (message.length < 5 || message.length > 1500) return Response.json({ error: "يرجى كتابة تفاصيل الرسالة" }, { status: 400 });
  const reference = `KJ-${Date.now().toString(36).toUpperCase().slice(-7)}`;
  const now = new Date();
  await getDb().insert(complaints).values({ reference, type, area, message, tableNumber, rating, status: "new", createdAt: now, updatedAt: now });
  return Response.json({ reference }, { status: 201 });
}
