import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

const cookieName = "khan_admin";

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function expectedToken() {
  const secret = env.ADMIN_SESSION_SECRET;
  const password = env.ADMIN_PASSWORD;
  if (!secret || !password) return null;
  return digest(`${secret}:${password}`);
}

export async function isAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  const expected = await expectedToken();
  return Boolean(token && expected && token === expected);
}

export async function setAdminCookie() {
  const token = await expectedToken();
  if (!token) throw new Error("Admin credentials are not configured");
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 });
}

export async function clearAdminCookie() { (await cookies()).delete(cookieName); }
