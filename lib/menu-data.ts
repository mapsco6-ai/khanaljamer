export type MenuItem = { id: string; name: string; category: string; price: number; image: string; description?: string; available: boolean };

export const menuCategories = ["الوجبات", "الدوروم", "المقبلات والإضافات"];

export const defaultMenu: MenuItem[] = [
  { id: "meal-adana", name: "وجبة كباب أضنا", category: "الوجبات", price: 6750, image: "/menu/kebab.webp", description: "كباب أضنا مشوي على الجمر مع الأرز والخضار", available: true },
  { id: "meal-urfa", name: "وجبة كباب أورفا", category: "الوجبات", price: 6750, image: "/menu/grill.webp", description: "كباب أورفا بنكهته التركية المميزة", available: true },
  { id: "meal-eggplant", name: "وجبة كباب بالباذنجان", category: "الوجبات", price: 6750, image: "/menu/mixed-grill.webp", available: true },
  { id: "meal-chicken-steak", name: "وجبة ستيك دجاج 300 غم", category: "الوجبات", price: 5750, image: "/menu/chicken.webp", available: true },
  { id: "meal-wings", name: "وجبة جناح", category: "الوجبات", price: 5250, image: "/menu/chicken.webp", available: true },
  { id: "meal-chicken-tikka", name: "وجبة تكة دجاج", category: "الوجبات", price: 5250, image: "/menu/chicken.webp", available: true },
  { id: "meal-kofta", name: "وجبة كفتة مشوية", category: "الوجبات", price: 7250, image: "/menu/mixed-grill.webp", available: true },
  { id: "meal-meat-tikka", name: "وجبة تكة لحم", category: "الوجبات", price: 6750, image: "/menu/grill.webp", available: true },
  { id: "meal-meat-dough", name: "وجبة لحم بعجين 175 غم", category: "الوجبات", price: 4500, image: "/menu/grill.webp", available: true },
  { id: "meal-kebab-dough", name: "وجبة كباب بلحم بعجين", category: "الوجبات", price: 8750, image: "/menu/kebab.webp", available: true },
  { id: "meal-chicken-kebab-kofta", name: "وجبة جيك كفتة", category: "الوجبات", price: 4000, image: "/menu/chicken.webp", available: true },
  { id: "durum-adana", name: "دوروم كباب أضنا", category: "الدوروم", price: 4500, image: "/menu/kebab.webp", available: true },
  { id: "durum-urfa", name: "دوروم كباب أورفا", category: "الدوروم", price: 4500, image: "/menu/grill.webp", available: true },
  { id: "durum-mix", name: "دوروم معلاك", category: "الدوروم", price: 4000, image: "/menu/mixed-grill.webp", available: true },
  { id: "durum-kofta", name: "دوروم كفتة", category: "الدوروم", price: 4000, image: "/menu/mixed-grill.webp", available: true },
  { id: "soup", name: "شوربة", category: "المقبلات والإضافات", price: 1000, image: "/menu/salad.webp", available: true },
  { id: "large-appetizer", name: "مقبلات طبق عائلي", category: "المقبلات والإضافات", price: 4000, image: "/menu/salad.webp", available: true },
  { id: "small-appetizer", name: "مقبلات طبق صغير", category: "المقبلات والإضافات", price: 1500, image: "/menu/salad.webp", available: true },
  { id: "dessert", name: "حلويات", category: "المقبلات والإضافات", price: 2500, image: "/menu/salad.webp", available: true },
  { id: "ayran", name: "لبن عيران", category: "المقبلات والإضافات", price: 1250, image: "/menu/salad.webp", available: true },
];

export function mergeMenu(overrides: Array<{ itemId: string; name: string; price: number; available: boolean; imageKey?: string | null }>) {
  const byId = new Map(overrides.map((item) => [item.itemId, item]));
  return defaultMenu.map((item) => {
    const override = byId.get(item.id);
    return { ...item, ...override, id: item.id, image: override?.imageKey ? `/api/menu-image/${encodeURIComponent(override.imageKey)}` : item.image };
  });
}

export function mapCustomMenu(items: Array<{ id: string; name: string; category: string; price: number; description: string; imageKey: string | null; available: boolean }>): MenuItem[] {
  return items.map((item) => ({ ...item, image: item.imageKey ? `/api/menu-image/${encodeURIComponent(item.imageKey)}` : "/menu/logo.webp" }));
}
