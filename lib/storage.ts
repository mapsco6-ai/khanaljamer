import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function contentTypeFor(key: string) {
  const extension = key.split(".").pop()?.toLowerCase() ?? "";
  return contentTypes[extension] ?? "application/octet-stream";
}

function safePath(key: string) {
  if (key.includes("/") || key.includes("\\") || key.includes("..")) throw new Error("Invalid storage key");
  return path.join(uploadsDir, key);
}

export async function putFile(key: string, data: ArrayBuffer) {
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(safePath(key), Buffer.from(data));
}

export async function getFile(key: string): Promise<{ body: Buffer; contentType: string } | null> {
  try {
    const body = await readFile(safePath(key));
    return { body, contentType: contentTypeFor(key) };
  } catch {
    return null;
  }
}

export async function deleteFile(key: string) {
  await rm(safePath(key), { force: true });
}
