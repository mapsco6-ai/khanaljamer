import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { complaints, customMenuItems, menuOverrides, offers } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { mapCustomMenu, mergeMenu } from "@/lib/menu-data";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "غير مصرح" }, { status: 401 });
  const db = getDb();
  const [overrides, custom, offerRows, messages] = await Promise.all([
    db.select().from(menuOverrides),
    db.select().from(customMenuItems),
    db.select().from(offers),
    db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(200),
  ]);
  return Response.json({ items: [...mergeMenu(overrides), ...mapCustomMenu(custom)], offers: offerRows.map((offer) => ({ ...offer, image: offer.imageKey ? `/api/menu-image/${encodeURIComponent(offer.imageKey)}` : "/menu/logo.webp" })), complaints: messages });
}
