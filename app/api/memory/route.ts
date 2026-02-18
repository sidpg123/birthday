import db from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

    

// API ROUTE TO UPLOAD METADAT OF MEMORY TO DB
export async function POST(req: NextRequest) {
    const { wishId, imageUrl, caption, order } = await req.json();

    if (!wishId || !imageUrl || !order) {
        return NextResponse.json({ status: "failed", message: "Missing required fields" }, { status: 400 });
    }

    await db.memory.create({
        data: {
            wishId,
            imageUrl,
            caption,
            order,
        }
    })

    return NextResponse.json({ status: "success" });
}