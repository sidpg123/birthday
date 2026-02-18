import db from "@/prisma/prisma";
import WishClient from "./WishClient";
import { notFound } from "next/navigation";
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
interface PageProps {
    params: { slug: string };
}

export default async function WishPage({ params }: PageProps) {
    const { slug } = await params;

    const wishData = await db.wish.findFirst({
        where: { slug },
        include: { memories: true },
    });
    // image key; `https://${process.env.AWS_CLOUDFRONT_DOMAIN_NAME}/${m.imageUrl}`;
    wishData?.memories.map((m) => {
        m.imageUrl = getSignedUrl({
            url: `https://${process.env.AWS_CLOUDFRONT_DOMAIN_NAME}/${m.imageUrl}`,
            keyPairId: process.env.CLOUDfRONT_KEY_PAIR_ID || '',
            privateKey: process.env.CLOUDFRONT_PRIVATE_KEY || '',
            dateLessThan: new Date(Date.now() + 1000 * 60 * 15).toISOString()
        })
        // m.imageUrl = 
        return m;
    }).sort((a, b) => a.order - b.order);

    if (!wishData) return notFound();

    return <WishClient wish={wishData} />;
}
