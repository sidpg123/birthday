"use server";

import { generateUniqueSlug } from "@/lib/server/utils";
// import { generateUniqueSlug } from "@/lib/utils";
import db from "@/prisma/prisma";

interface MemoryInput {
  imageUrl: string;
  caption?: string;
  order: number;
}

interface CreateWishFormData {
  senderName: string;
  recipientName: string;
  wishId: string;
  message: string;
  memories: MemoryInput[];
}

export async function createWish(formData: CreateWishFormData) {
  const { senderName, message, recipientName, memories, wishId } = formData;

  if (!senderName || !message || !recipientName || !wishId) {
    throw new Error("Missing required fields");
  }

  // expire after 3 days
  

  // ensure draft exists
  const existingWish = await db.wish.findUnique({
    where: { id: wishId },
  });

  if (!existingWish) {
    throw new Error("Wish session not found");
  }

  const slug = await generateUniqueSlug(recipientName);


  // update wish
  const wish = await db.wish.update({
    where: { id: wishId },
    data: {
      senderName,
      recipientName,
      message,
      status: "published",
      slug,
      // create memories only if provided
      memories:
        memories.length > 0
          ? {
              create: memories.map((memory) => ({
                imageUrl: memory.imageUrl,
                caption: memory.caption,
                order: memory.order,
              })),
            }
          : undefined,
    },
    include: {
      memories: true,
    },
  });

  return wish;
}
