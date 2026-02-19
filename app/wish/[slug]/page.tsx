import db from "@/prisma/prisma";
import WishClient from "./WishClient";
import { notFound } from "next/navigation";
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

export default async function WishPage({
    params,
}: {
    params: Promise<{ slug: string }>;  // ← Promise<> wrapper here
}) {
    const { slug } = await params;  // ← await here


    const wishData = await db.wish.findFirst({
        where: { slug },
        include: { memories: true },
    });
    // image key; `https://${process.env.AWS_CLOUDFRONT_DOMAIN_NAME}/${m.imageUrl}`;

    wishData!.envelopeImageUrl = getSignedUrl({
        url: `https://${process.env.AWS_CLOUDFRONT_DOMAIN_NAME}/${wishData?.envelopeImageUrl}`,
        keyPairId: process.env.CLOUDfRONT_KEY_PAIR_ID || '',
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY || '',
        dateLessThan: new Date(Date.now() + 1000 * 60 * 15).toISOString()
    })


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
