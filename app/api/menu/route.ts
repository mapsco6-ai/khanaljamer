import { getDb } from "@/db";
import { customMenuItems, menuOverrides, offers } from "@/db/schema";
import { mapCustomMenu, mergeMenu } from "@/lib/menu-data";

export async function GET() {
  const db = getDb();
  const [overrides, custom, offerRows] = await Promise.all([db.select().from(menuOverrides), db.select().from(customMenuItems), db.select().from(offers)]);
  const now = Date.now();
  const visibleOffers = offerRows.filter((offer) => offer.active && (!offer.startsAt || offer.startsAt.getTime() <= now) && (!offer.endsAt || offer.endsAt.getTime() >= now)).map((offer) => ({ ...offer, image: offer.imageKey ? `/api/menu-image/${encodeURIComponent(offer.imageKey)}` : "/menu/logo.webp" }));
  return Response.json({ items: [...mergeMenu(overrides), ...mapCustomMenu(custom)], offers: visibleOffers });
}
