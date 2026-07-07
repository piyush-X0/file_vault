import "dotenv/config";
import { prisma } from "../lib/prisma";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, BUCKET_NAME } from "../lib/r2";
const STALE_AFTER_MINUTES = 15;

export async function SweepStaleUploads() {
    const cutoff = new Date(Date.now() - STALE_AFTER_MINUTES * 60 * 1000);

    const staleDocuments = await prisma.document.findMany({
        where: { uploadStatus: "PENDING", createdAt: { lt: cutoff } },
        select: { id: true, r2key: true }
    });

    for (const doc of staleDocuments) {
        try {
            await r2Client.send(
                new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: doc.r2key })
            );
            await prisma.document.update({
                where: { id: doc.id },
                data: { uploadStatus: "UPLOADED" }
            });
        } catch (error) {
            await prisma.document.update({
                where: { id: doc.id },
                data: { uploadStatus: "FAILED" }
            });
        }
    }
    console.log(`swept ${staleDocuments.length} stale PENDING documents`)
}
SweepStaleUploads();