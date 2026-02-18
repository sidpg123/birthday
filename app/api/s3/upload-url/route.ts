import { generateUploadUrl } from "@/services/s3.service";
import { NextRequest, NextResponse } from "next/server";


// API ROUTE TO GENERATE S3 UPLOAD URL
export async function POST(req: NextRequest) {
    const { key } = await req.json();

    if (!key) {
        return NextResponse.json({ status: "failed", message: "Missing key" }, { status: 400 });
    }

    const s3UploadURL = await generateUploadUrl(key, "image/jpeg");

    return NextResponse.json({ status: "success", uploadUrl: s3UploadURL });

}