import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { complaints } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const data = await request.json() as { id?: number; status?: string; managerNote?: string };
  const allowed = ["new", "reviewing", "resolved", "closed"];
  if (!Number.isInteger(data.id) || !allowed.includes(String(data.status))) return Response.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  await getDb().update(complaints).set({ status: String(data.status), managerNote: String(data.managerNote ?? "").slice(0, 1000), updatedAt: new Date() }).where(eq(complaints.id, Number(data.id)));
  return Response.json({ ok: true });
}
