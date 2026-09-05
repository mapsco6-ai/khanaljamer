import { getFile } from "@/lib/storage";

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  if ((!key.startsWith("menu-") && !key.startsWith("offer-")) || key.includes("/")) return new Response("Not found", { status: 404 });
  const file = await getFile(key);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.body), {
    headers: {
      "content-type": file.contentType,
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
