import { clearAdminCookie, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json() as { password?: string };
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return Response.json({ error: "رمز الدخول غير صحيح" }, { status: 401 });
  await setAdminCookie();
  return Response.json({ ok: true });
}

export async function DELETE() { await clearAdminCookie(); return Response.json({ ok: true }); }
