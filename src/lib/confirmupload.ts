import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { r2Client, BUCKET_NAME } from "./r2";
import { HeadObjectCommand } from "@aws-sdk/client-s3";


export async function confirmUpload(documentId: string) {

    const document = await prisma.document.findUnique({
        where: { id: documentId },
        select: { id: true, r2key: true, uploadStatus: true }
    });
    if (!document) {
        return { ok: false as const, reason: "NOT_FOUND" as const };
    }
    if (document.uploadStatus == "UPLOADED") {
        return { ok: true as const, reason: "ALREADY_UPLOADED" };
    }

    try {
        await r2Client.send(
            new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: document.r2key })
        )

    } catch {
        await prisma.document.update({
            where: { id: documentId },
            data: { uploadStatus: "FAILED" }
        });
        return { ok: false as const, reason: "FILE_NOT_IN_STORAGE" as const }
    }

    const updated = await prisma.document.update({
        where: { id: documentId },
        data: { uploadStatus: "UPLOADED" }
    });
    return { ok: true as const, status: updated.uploadStatus }
}