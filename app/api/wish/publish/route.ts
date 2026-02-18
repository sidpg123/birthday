
// import { generateUniqueSlug } from "@/lib/utils";
import { generateUniqueSlug } from "@/lib/server/utils";
import db from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
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
    envelopeImageUrl: string;
    memories: MemoryInput[];
}

// This route handles both creating a new wish session (GET) and publishing a wish (POST)

export async function POST(req: NextRequest) {
    const { senderName, message, recipientName, memories, wishId, envelopeImageUrl }: CreateWishFormData = await req.json();;

    if (!senderName || !message || !recipientName || !wishId) {
        throw new Error("Missing required fields");
    }

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
            envelopeImageUrl,
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

    return NextResponse.json({ message: "Wish creaeated successfully", slug: wish.slug })

}