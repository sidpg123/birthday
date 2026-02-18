import "server-only";
import db from "@/prisma/prisma";
import { nanoid } from "nanoid";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function generateUniqueSlug(name: string) {
  const base = slugify(name);

  for (let i = 0; i < 5; i++) {
    const slug = `${base}-${nanoid(6)}`;

    const existing = await db.wish.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) return slug;
  }

  throw new Error("Failed to generate unique slug");
}
