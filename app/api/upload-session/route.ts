import { NextResponse } from "next/server";
import db from '@/prisma/prisma';
export async function POST() {

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);

    const wish = await db.wish.create({
        data: {
            senderName: "",
            recipientName: "",
            message: "",
            expiresAt,
        }
    })

    return NextResponse.json({ wishId: wish.id });
}