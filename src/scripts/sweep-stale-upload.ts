import "dotenv/config";
import { prisma } from "../lib/prisma";
import { confirmUpload } from "@/lib/confirmupload";
const STALE_AFTER_MINUTES = 15;

export async function SweepStaleUploads() {
    const cutoff = new Date(Date.now() - STALE_AFTER_MINUTES * 60 * 1000);

    const staleDocuments = await prisma.document.findMany({
        where: { uploadStatus: "PENDING", createdAt: { lt: cutoff } },
        select: { id: true }
    });

    let uploaded = 0;
    let failed = 0;

    for (const doc of staleDocuments) {
        const result = await confirmUpload(doc.id);
        if (result.ok) {
            uploaded++;
        } else {
            failed++;
        }
    }

    console.log(`swept ${staleDocuments.length} stale PENDING documents (${uploaded} uploaded, ${failed} failed)`);
}

SweepStaleUploads();